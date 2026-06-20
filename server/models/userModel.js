import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { supabase } from "../config/supabase.js";
import { fromDbRow, omitPassword } from "../lib/rowMapper.js";

const TABLE = "users";

const mapUserRow = (row, { includePassword = false } = {}) => {
  if (!row) return null;

  const user = fromDbRow(row);
  user.tokenExpire = row.token_expire ?? undefined;
  user.tokenValidityInMinutes = row.token_validity_in_minutes ?? undefined;
  user.is_verified = row.is_verified;
  user.is_blocked = row.is_blocked;
  user.is_visible = row.is_visible;
  user.user_type = row.user_type;
  user.about_us = row.about_us;
  user.admin_id = row.admin_id;
  user.profile_picture = row.profile_picture;
  user.cover_picture = row.cover_picture;
  user.stripe_customer_id = row.stripe_customer_id;
  user.current_plan_id = row.current_plan_id;
  user.resetPasswordToken = row.reset_password_token;
  user.resetPasswordExpire = row.reset_password_expire;

  if (!includePassword) {
    return omitPassword(user);
  }

  return user;
};

const userToDb = (user) => {
  const row = {
    name: user.name,
    email: user.email,
    password: user.password,
    admin_id: user.admin_id ?? null,
    slug: user.slug ?? null,
    about_us: user.about_us ?? null,
    is_blocked: user.is_blocked ?? false,
    is_verified: user.is_verified ?? false,
    is_visible: user.is_visible ?? true,
    user_type: user.user_type ?? "user",
    phone: user.phone ?? null,
    profile_picture: user.profile_picture ?? null,
    cover_picture: user.cover_picture ?? null,
    country: user.country ?? null,
    stripe_customer_id: user.stripe_customer_id ?? null,
    current_plan_id: user.current_plan_id ?? null,
    reset_password_token: user.resetPasswordToken ?? null,
    reset_password_expire: user.resetPasswordExpire ?? null,
    token: user.token ?? null,
    token_validity_in_minutes: user.tokenValidityInMinutes ?? null,
    token_expire: user.tokenExpire ?? null,
  };

  return Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined)
  );
};

class UserQuery {
  constructor(filters = {}, options = {}) {
    this.filters = filters;
    this.options = options;
  }

  select(fields) {
    this.options.includePassword = fields?.includes("+password");
    return this;
  }

  async _execute() {
    let query = supabase.from(TABLE).select("*");

    if (this.filters._id || this.filters.id) {
      query = query.eq("id", this.filters._id || this.filters.id);
    }

    if (this.filters.email) {
      query = query.eq("email", this.filters.email);
    }

    if (this.filters.token) {
      query = query.eq("token", this.filters.token);
    }

    if (this.filters.tokenExpire?.$gt !== undefined) {
      query = query.gt("token_expire", this.filters.tokenExpire.$gt);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) return null;

    const mapped = mapUserRow(data, this.options);
    return new User({ ...mapped, password: data.password, isNew: false });
  }

  then(resolve, reject) {
    return this._execute().then(resolve, reject);
  }
}

class User {
  constructor(data = {}) {
    Object.assign(this, data);
    this.isNew = !this._id && !this.id;
    this._passwordModified = Boolean(data.password && this.isNew);
  }

  comparePassword = async (enteredPassword) => {
    return bcrypt.compare(enteredPassword, this.password);
  };

  SignAccessToken = () => {
    return jwt.sign({ id: this._id || this.id }, process.env.ACCESS_TOKEN || "", {
      expiresIn: "7d",
    });
  };

  SignRefreshToken = () => {
    return jwt.sign({ id: this._id || this.id }, process.env.REFRESH_TOKEN || "", {
      expiresIn: "3d",
    });
  };

  getVerificationCode = (minutesToExpire = 15) => {
    const code = String(crypto.randomInt(100000, 999999));
    this.token = crypto.createHash("sha256").update(code).digest("hex");
    this.tokenValidityInMinutes = minutesToExpire;
    this.tokenExpire = Date.now() + minutesToExpire * 60 * 1000;
    return code;
  };

  getToken = (minutesToExpire = 15) => {
    const userToken = crypto.randomBytes(20).toString("hex");
    this.token = crypto.createHash("sha256").update(userToken).digest("hex");
    this.tokenValidityInMinutes = minutesToExpire;
    this.tokenExpire = Date.now() + minutesToExpire * 60 * 1000;
    return userToken;
  };

  toJSON() {
    return omitPassword({ ...this, _id: this._id || this.id });
  }

  save = async () => {
    if (
      this.password &&
      (this._passwordModified || !this.password.startsWith("$2"))
    ) {
      this.password = await bcrypt.hash(this.password, 10);
      this._passwordModified = false;
    }

    const payload = userToDb(this);

    if (!this.isNew) {
      if (this.token === undefined) payload.token = null;
      if (this.tokenExpire === undefined) payload.token_expire = null;
      if (this.tokenValidityInMinutes === undefined) {
        payload.token_validity_in_minutes = null;
      }
    }

    if (this.isNew) {
      const { data, error } = await supabase
        .from(TABLE)
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      Object.assign(this, mapUserRow(data, { includePassword: true }));
      this.isNew = false;
      return this;
    }

    const id = this._id || this.id;
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    Object.assign(this, mapUserRow(data, { includePassword: true }));
    return this;
  };

  static findOne(filters) {
    return new UserQuery(filters);
  }

  static findById(id) {
    return new UserQuery({ id });
  }

  static async deleteOne(filters) {
    const id = filters._id || filters.id;
    const { error } = await supabase.from(TABLE).delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }
}

export default User;

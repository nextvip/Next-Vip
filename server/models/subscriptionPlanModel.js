import { supabase } from "../config/supabase.js";
import { fromDbRow } from "../lib/rowMapper.js";

const TABLE = "subscription_plans";

const mapPlanRow = (row) => {
  if (!row) return null;
  const plan = fromDbRow(row);
  plan.price_monthly = row.price_monthly != null ? Number(row.price_monthly) : 0;
  plan.price_yearly = row.price_yearly != null ? Number(row.price_yearly) : 0;
  plan.is_active = row.is_active;
  plan.sort_order = row.sort_order;
  return plan;
};

const SubscriptionPlan = {
  async findOneAndUpdate(filters, update, options = {}) {
    const { data: existing, error: findError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("slug", filters.slug)
      .maybeSingle();

    if (findError) {
      throw new Error(findError.message);
    }

    if (existing) {
      const { data, error } = await supabase
        .from(TABLE)
        .update(update)
        .eq("id", existing.id)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapPlanRow(data);
    }

    if (options.upsert) {
      const { data, error } = await supabase
        .from(TABLE)
        .insert(update)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapPlanRow(data);
    }

    return null;
  },
};

export default SubscriptionPlan;

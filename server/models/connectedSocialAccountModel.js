import mongoose from "mongoose";
import { PLATFORMS } from "./constants.js";

const connectedSocialAccountSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      enum: PLATFORMS,
      required: true,
    },
    platform_account_id: {
      type: String,
      required: true,
    },
    account_name: {
      type: String,
      trim: true,
    },
    account_username: {
      type: String,
      trim: true,
    },
    profile_image_url: {
      type: String,
    },
    access_token: {
      type: String,
      select: false,
    },
    refresh_token: {
      type: String,
      select: false,
    },
    token_expires_at: {
      type: Date,
    },
    scopes: {
      type: [String],
      default: [],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    last_synced_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

connectedSocialAccountSchema.index(
  { user_id: 1, platform: 1, platform_account_id: 1 },
  { unique: true }
);
connectedSocialAccountSchema.index({ user_id: 1, is_active: 1 });

const ConnectedSocialAccount = mongoose.model(
  "ConnectedSocialAccount",
  connectedSocialAccountSchema
);

export default ConnectedSocialAccount;

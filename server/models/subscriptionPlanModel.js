import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Plan slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price_monthly: {
      type: Number,
      default: 0,
      min: 0,
    },
    price_yearly: {
      type: Number,
      default: 0,
      min: 0,
    },
    stripe_price_id_monthly: {
      type: String,
    },
    stripe_price_id_yearly: {
      type: String,
    },
    max_videos: {
      type: Number,
      default: 0,
    },
    max_automations: {
      type: Number,
      default: 0,
    },
    max_connected_accounts: {
      type: Number,
      default: 0,
    },
    max_scheduled_posts: {
      type: Number,
      default: 0,
    },
    ai_generations_per_month: {
      type: Number,
      default: 0,
    },
    features: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    sort_order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionPlanSchema.index({ is_active: 1, sort_order: 1 });

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);

export default SubscriptionPlan;

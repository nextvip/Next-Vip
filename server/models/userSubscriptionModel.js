import mongoose from "mongoose";
import { BILLING_CYCLES, SUBSCRIPTION_STATUSES } from "./constants.js";

const userSubscriptionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    stripe_subscription_id: {
      type: String,
    },
    status: {
      type: String,
      enum: SUBSCRIPTION_STATUSES,
      default: "incomplete",
    },
    billing_cycle: {
      type: String,
      enum: BILLING_CYCLES,
      default: "monthly",
    },
    current_period_start: {
      type: Date,
    },
    current_period_end: {
      type: Date,
    },
    cancel_at_period_end: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSubscriptionSchema.index({ user_id: 1, status: 1 });
userSubscriptionSchema.index({ stripe_subscription_id: 1 }, { sparse: true });

const UserSubscription = mongoose.model(
  "UserSubscription",
  userSubscriptionSchema
);

export default UserSubscription;

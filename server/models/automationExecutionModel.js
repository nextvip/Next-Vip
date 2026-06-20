import mongoose from "mongoose";
import { AUTOMATION_EXECUTION_STATUSES } from "./constants.js";

const automationExecutionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AutomationRule",
      default: null,
    },
    template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AutomationTemplate",
      default: null,
    },
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SocialComment",
      default: null,
    },
    trigger_type: {
      type: String,
      required: true,
    },
    trigger_data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    public_reply_sent: {
      type: Boolean,
      default: false,
    },
    public_reply_text: {
      type: String,
    },
    dm_sent: {
      type: Boolean,
      default: false,
    },
    dm_text: {
      type: String,
    },
    affiliate_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AffiliateProduct",
      default: null,
    },
    affiliate_link_used: {
      type: String,
    },
    status: {
      type: String,
      enum: AUTOMATION_EXECUTION_STATUSES,
      default: "success",
    },
    error_message: {
      type: String,
    },
    executed_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

automationExecutionSchema.index({ user_id: 1, executed_at: -1 });
automationExecutionSchema.index({ rule_id: 1 });
automationExecutionSchema.index({ comment_id: 1 }, { sparse: true });

const AutomationExecution = mongoose.model(
  "AutomationExecution",
  automationExecutionSchema
);

export default AutomationExecution;

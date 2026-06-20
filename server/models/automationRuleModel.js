import mongoose from "mongoose";
import { TRIGGER_TYPES } from "./constants.js";

const automationRuleSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Rule name is required"],
      trim: true,
    },
    trigger_type: {
      type: String,
      enum: TRIGGER_TYPES,
      required: true,
    },
    conditions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    actions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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
    priority: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

automationRuleSchema.index({ user_id: 1, is_active: 1, priority: -1 });
automationRuleSchema.index({ user_id: 1, trigger_type: 1 });

const AutomationRule = mongoose.model("AutomationRule", automationRuleSchema);

export default AutomationRule;

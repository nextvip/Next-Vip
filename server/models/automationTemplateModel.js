import mongoose from "mongoose";

const automationTemplateSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
    },
    trigger_keywords: {
      type: [String],
      default: [],
    },
    public_reply_template: {
      type: String,
      trim: true,
    },
    private_dm_template: {
      type: String,
      trim: true,
    },
    custom_variables: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    affiliate_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AffiliateProduct",
      default: null,
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

automationTemplateSchema.index({ user_id: 1, is_active: 1 });
automationTemplateSchema.index({ user_id: 1, video_id: 1 });

const AutomationTemplate = mongoose.model(
  "AutomationTemplate",
  automationTemplateSchema
);

export default AutomationTemplate;

import mongoose from "mongoose";
import { AFFILIATE_PLATFORMS } from "./constants.js";

const affiliateProductSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Product label is required"],
      trim: true,
    },
    product_name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    affiliate_link: {
      type: String,
      required: [true, "Affiliate link is required"],
      trim: true,
    },
    platform: {
      type: String,
      enum: AFFILIATE_PLATFORMS,
      default: "other",
    },
    product_image_url: {
      type: String,
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

affiliateProductSchema.index({ user_id: 1, is_active: 1 });

const AffiliateProduct = mongoose.model(
  "AffiliateProduct",
  affiliateProductSchema
);

export default AffiliateProduct;

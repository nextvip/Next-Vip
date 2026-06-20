import mongoose from "mongoose";

const videoAffiliateProductSchema = new mongoose.Schema(
  {
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    affiliate_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AffiliateProduct",
      required: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

videoAffiliateProductSchema.index(
  { video_id: 1, affiliate_product_id: 1 },
  { unique: true }
);
videoAffiliateProductSchema.index({ video_id: 1, is_default: 1 });

const VideoAffiliateProduct = mongoose.model(
  "VideoAffiliateProduct",
  videoAffiliateProductSchema
);

export default VideoAffiliateProduct;

import mongoose from "mongoose";
import { VIDEO_SOURCE_TYPES, VIDEO_STATUSES } from "./constants.js";

const videoSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    source_type: {
      type: String,
      enum: VIDEO_SOURCE_TYPES,
      default: "upload",
    },
    file_url: {
      type: String,
    },
    source_url: {
      type: String,
    },
    thumbnail_url: {
      type: String,
    },
    duration: {
      type: Number,
      min: 0,
    },
    file_size: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: VIDEO_STATUSES,
      default: "draft",
    },
    folder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VideoFolder",
      default: null,
    },
    default_affiliate_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AffiliateProduct",
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.index({ user_id: 1, status: 1 });
videoSchema.index({ user_id: 1, folder_id: 1 });
videoSchema.index({ createdAt: -1 });

const Video = mongoose.model("Video", videoSchema);

export default Video;

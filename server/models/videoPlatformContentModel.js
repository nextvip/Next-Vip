import mongoose from "mongoose";
import { CONTENT_STATUSES, PLATFORMS } from "./constants.js";

const videoPlatformContentSchema = new mongoose.Schema(
  {
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    platform: {
      type: String,
      enum: PLATFORMS,
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
    hashtags: {
      type: [String],
      default: [],
    },
    caption: {
      type: String,
      trim: true,
    },
    ai_generated: {
      type: Boolean,
      default: false,
    },
    ai_prompt_version: {
      type: String,
    },
    status: {
      type: String,
      enum: CONTENT_STATUSES,
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

videoPlatformContentSchema.index({ video_id: 1, platform: 1 }, { unique: true });

const VideoPlatformContent = mongoose.model(
  "VideoPlatformContent",
  videoPlatformContentSchema
);

export default VideoPlatformContent;

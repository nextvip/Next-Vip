import mongoose from "mongoose";
import { PLATFORMS, PUBLICATION_STATUSES } from "./constants.js";

const publicationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    connected_account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConnectedSocialAccount",
      required: true,
    },
    platform: {
      type: String,
      enum: PLATFORMS,
      required: true,
    },
    platform_post_id: {
      type: String,
    },
    post_url: {
      type: String,
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
    status: {
      type: String,
      enum: PUBLICATION_STATUSES,
      default: "pending",
    },
    error_message: {
      type: String,
    },
    published_at: {
      type: Date,
    },
    scheduled_post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScheduledPost",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

publicationSchema.index({ user_id: 1, video_id: 1 });
publicationSchema.index({ video_id: 1, platform: 1 });
publicationSchema.index({ platform_post_id: 1 }, { sparse: true });
publicationSchema.index({ published_at: -1 });

const Publication = mongoose.model("Publication", publicationSchema);

export default Publication;

import mongoose from "mongoose";
import { PLATFORMS, SCHEDULED_POST_STATUSES } from "./constants.js";

const scheduledPostSchema = new mongoose.Schema(
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
    scheduled_at: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    target_platforms: {
      type: [String],
      enum: PLATFORMS,
      default: [],
    },
    target_account_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ConnectedSocialAccount",
      default: [],
    },
    automations_enabled: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: SCHEDULED_POST_STATUSES,
      default: "scheduled",
    },
    error_message: {
      type: String,
    },
    executed_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

scheduledPostSchema.index({ user_id: 1, status: 1 });
scheduledPostSchema.index({ scheduled_at: 1, status: 1 });

const ScheduledPost = mongoose.model("ScheduledPost", scheduledPostSchema);

export default ScheduledPost;

import mongoose from "mongoose";
import { PLATFORMS } from "./constants.js";

const socialCommentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publication_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publication",
      required: true,
    },
    platform: {
      type: String,
      enum: PLATFORMS,
      required: true,
    },
    platform_comment_id: {
      type: String,
      required: true,
    },
    author_username: {
      type: String,
      trim: true,
    },
    author_platform_id: {
      type: String,
    },
    comment_text: {
      type: String,
      required: true,
      trim: true,
    },
    parent_comment_id: {
      type: String,
      default: null,
    },
    received_at: {
      type: Date,
      default: Date.now,
    },
    processed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

socialCommentSchema.index(
  { platform: 1, platform_comment_id: 1 },
  { unique: true }
);
socialCommentSchema.index({ publication_id: 1, processed: 1 });
socialCommentSchema.index({ user_id: 1, received_at: -1 });

const SocialComment = mongoose.model("SocialComment", socialCommentSchema);

export default SocialComment;

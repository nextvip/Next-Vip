import mongoose from "mongoose";
import { AI_GENERATION_TYPES, PLATFORMS } from "./constants.js";

const aiGenerationSchema = new mongoose.Schema(
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
    platform: {
      type: String,
      enum: PLATFORMS,
    },
    generation_type: {
      type: String,
      enum: AI_GENERATION_TYPES,
      required: true,
    },
    prompt: {
      type: String,
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
    },
    model: {
      type: String,
    },
    tokens_used: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
    error_message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

aiGenerationSchema.index({ user_id: 1, createdAt: -1 });
aiGenerationSchema.index({ video_id: 1 });

const AiGeneration = mongoose.model("AiGeneration", aiGenerationSchema);

export default AiGeneration;

import mongoose from "mongoose";
import { WEBHOOK_SOURCES } from "./constants.js";

const webhookEventSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: WEBHOOK_SOURCES,
      required: true,
    },
    event_type: {
      type: String,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
    },
    processed_at: {
      type: Date,
    },
    error_message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

webhookEventSchema.index({ source: 1, processed: 1 });
webhookEventSchema.index({ createdAt: -1 });

const WebhookEvent = mongoose.model("WebhookEvent", webhookEventSchema);

export default WebhookEvent;

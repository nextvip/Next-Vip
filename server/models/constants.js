export const PLATFORMS = ["tiktok", "instagram", "facebook", "youtube"];

export const AFFILIATE_PLATFORMS = ["amazon", "tiktok_shop", "other"];

export const VIDEO_SOURCE_TYPES = ["upload", "tiktok_link", "url"];

export const VIDEO_STATUSES = [
  "draft",
  "ready",
  "processing",
  "published",
  "failed",
];

export const CONTENT_STATUSES = ["draft", "approved", "published"];

export const PUBLICATION_STATUSES = [
  "pending",
  "published",
  "failed",
  "deleted",
];

export const SUBSCRIPTION_STATUSES = [
  "active",
  "canceled",
  "past_due",
  "trialing",
  "incomplete",
];

export const BILLING_CYCLES = ["monthly", "yearly"];

export const TRIGGER_TYPES = [
  "keyword_comment",
  "video_uploaded",
  "published_on_platform",
];

export const SCHEDULED_POST_STATUSES = [
  "scheduled",
  "processing",
  "completed",
  "failed",
  "canceled",
];

export const AUTOMATION_EXECUTION_STATUSES = ["success", "partial", "failed"];

export const AI_GENERATION_TYPES = [
  "title",
  "description",
  "hashtags",
  "reply",
  "full_adaptation",
];

export const PAYMENT_STATUSES = ["paid", "failed", "refunded", "pending"];

export const WEBHOOK_SOURCES = ["stripe", "tiktok", "meta", "youtube"];

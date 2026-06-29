import { supabase } from "../config/supabase.js";
import { fromDbRow } from "../lib/rowMapper.js";

const mapContent = (row) => {
  if (!row) return null;
  const content = fromDbRow(row);
  content.video_id = row.video_id;
  content.platform = row.platform;
  content.title = row.title;
  content.description = row.description;
  content.hashtags = row.hashtags || [];
  content.caption = row.caption;
  content.ai_generated = row.ai_generated;
  content.ai_prompt_version = row.ai_prompt_version;
  content.status = row.status;
  return content;
};

export const listPlatformContents = async (videoId) => {
  const { data, error } = await supabase
    .from("video_platform_contents")
    .select("*")
    .eq("video_id", videoId)
    .order("platform", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapContent);
};

export const getPlatformContent = async (videoId, platform) => {
  const { data, error } = await supabase
    .from("video_platform_contents")
    .select("*")
    .eq("video_id", videoId)
    .eq("platform", platform)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return mapContent(data);
};

export const upsertPlatformContent = async (videoId, platform, payload) => {
  const row = {
    video_id: videoId,
    platform,
    title: payload.title ?? null,
    description: payload.description ?? null,
    hashtags: payload.hashtags ?? [],
    caption: payload.caption ?? null,
    ai_generated: payload.aiGenerated ?? payload.ai_generated ?? false,
    ai_prompt_version: payload.aiPromptVersion ?? payload.ai_prompt_version ?? null,
    status: payload.status ?? "draft",
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("video_platform_contents")
    .upsert(row, { onConflict: "video_id,platform" })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapContent(data);
};

export const applyAiResultToPlatformContent = async (
  videoId,
  platform,
  aiResult,
  generationType
) => {
  const existing = await getPlatformContent(videoId, platform);
  const patch = {
    ai_generated: true,
    ai_prompt_version: "m3-v1",
    status: existing?.status || "draft",
  };

  if (generationType === "title" || generationType === "full_adaptation") {
    if (aiResult.title) patch.title = aiResult.title;
  }
  if (generationType === "description" || generationType === "full_adaptation") {
    if (aiResult.description) patch.description = aiResult.description;
  }
  if (generationType === "hashtags" || generationType === "full_adaptation") {
    if (aiResult.hashtags) patch.hashtags = aiResult.hashtags;
  }

  return upsertPlatformContent(videoId, platform, patch);
};

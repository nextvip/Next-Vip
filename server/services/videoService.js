import { supabase } from "../config/supabase.js";
import { fromDbRow } from "../lib/rowMapper.js";
import { getUserPlan } from "./subscriptionService.js";

const mapVideo = (row) => {
  if (!row) return null;
  const video = fromDbRow(row);
  video.source_type = row.source_type;
  video.file_url = row.file_url;
  video.source_url = row.source_url;
  video.thumbnail_url = row.thumbnail_url;
  video.folder_id = row.folder_id;
  video.default_affiliate_product_id = row.default_affiliate_product_id;
  return video;
};

export const listVideos = async (userId) => {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(mapVideo);
};

export const getVideoById = async (userId, videoId) => {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", videoId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return mapVideo(data);
};

export const countUserVideos = async (userId) => {
  const { count, error } = await supabase
    .from("videos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return count || 0;
};

export const assertVideoLimit = async (userId) => {
  const plan = await getUserPlan(userId);
  if (!plan || plan.max_videos === 0) return;

  const count = await countUserVideos(userId);
  if (count >= plan.max_videos) {
    throw new Error(
      `Video limit reached (${plan.max_videos}). Upgrade your plan to upload more.`
    );
  }
};

export const createVideo = async (userId, payload) => {
  await assertVideoLimit(userId);

  const { data, error } = await supabase
    .from("videos")
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapVideo(data);
};

export const updateVideo = async (userId, videoId, payload) => {
  const { data, error } = await supabase
    .from("videos")
    .update(payload)
    .eq("id", videoId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapVideo(data);
};

export const deleteVideo = async (userId, videoId) => {
  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", videoId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

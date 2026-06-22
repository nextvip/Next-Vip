import { supabase } from "../config/supabase.js";
import { fromDbRow } from "../lib/rowMapper.js";

const mapPublication = (row) => {
  if (!row) return null;
  const publication = fromDbRow(row);
  publication.video_id = row.video_id;
  publication.platform = row.platform;
  publication.platform_post_id = row.platform_post_id;
  publication.post_url = row.post_url;
  publication.published_at = row.published_at;
  if (row.videos) {
    publication.video = fromDbRow(row.videos);
  }
  return publication;
};

export const listPublications = async (userId) => {
  const { data, error } = await supabase
    .from("publications")
    .select("*, videos(id, title, thumbnail_url, status)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(mapPublication);
};

export const createPublication = async (userId, payload) => {
  const { data: video, error: videoError } = await supabase
    .from("videos")
    .select("id")
    .eq("id", payload.video_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (videoError) throw new Error(videoError.message);
  if (!video) throw new Error("Video not found");

  const insertPayload = {
    user_id: userId,
    video_id: payload.video_id,
    platform: payload.platform,
    title: payload.title || null,
    description: payload.description || null,
    hashtags: payload.hashtags || [],
    status: payload.status || "pending",
    post_url: payload.post_url || null,
    platform_post_id: payload.platform_post_id || null,
    published_at: payload.status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("publications")
    .insert(insertPayload)
    .select("*, videos(id, title, thumbnail_url, status)")
    .single();

  if (error) throw new Error(error.message);
  return mapPublication(data);
};

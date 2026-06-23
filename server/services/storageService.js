import path from "path";
import { supabase } from "../config/supabase.js";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "videos";

export const uploadVideoToStorage = async ({
  userId,
  buffer,
  mimeType,
  originalName,
}) => {
  const ext = path.extname(originalName || "") || ".mp4";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const storagePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  return {
    publicUrl: data.publicUrl,
    storagePath,
    bucket: BUCKET,
  };
};

export const deleteVideoFromStorage = async (storagePath) => {
  if (!storagePath) return;

  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);

  if (error) {
    throw new Error(error.message);
  }
};

export const getStoragePathFromUrl = (fileUrl) => {
  if (!fileUrl || !fileUrl.includes("/storage/v1/object/")) return null;

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const signedMarker = `/storage/v1/object/sign/${BUCKET}/`;

  for (const prefix of [marker, signedMarker]) {
    const idx = fileUrl.indexOf(prefix);
    if (idx !== -1) {
      return decodeURIComponent(fileUrl.slice(idx + prefix.length).split("?")[0]);
    }
  }

  return null;
};

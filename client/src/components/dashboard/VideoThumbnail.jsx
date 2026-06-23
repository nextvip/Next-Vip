import { useState } from "react";
import { FileVideo, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VideoThumbnail({
  fileUrl,
  sourceUrl,
  thumbnailUrl,
  title,
  className,
}) {
  const [failed, setFailed] = useState(false);
  const previewSrc = thumbnailUrl || fileUrl;
  const isImage = previewSrc && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(previewSrc);

  if (!previewSrc && sourceUrl) {
    return (
      <div
        className={cn(
          "flex h-14 w-24 items-center justify-center rounded-lg bg-violet-50 border border-violet-100 shrink-0",
          className
        )}
      >
        <Link2 className="h-5 w-5 text-violet-400" />
      </div>
    );
  }

  if (!previewSrc || failed) {
    return (
      <div
        className={cn(
          "flex h-14 w-24 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 shrink-0",
          className
        )}
      >
        <FileVideo className="h-5 w-5 text-slate-400" />
      </div>
    );
  }

  if (isImage) {
    return (
      <img
        src={previewSrc}
        alt={title ? `${title} thumbnail` : "Video thumbnail"}
        className={cn(
          "h-14 w-24 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0",
          className
        )}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <video
      src={previewSrc}
      preload="metadata"
      muted
      playsInline
      className={cn(
        "h-14 w-24 rounded-lg object-cover bg-slate-900 border border-slate-200 shrink-0",
        className
      )}
      onLoadedMetadata={(e) => {
        const video = e.currentTarget;
        if (video.duration && Number.isFinite(video.duration)) {
          video.currentTime = Math.min(1, video.duration * 0.05);
        }
      }}
      onError={() => setFailed(true)}
    />
  );
}

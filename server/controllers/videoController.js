import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import {
  listVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  assertVideoLimit,
} from "../services/videoService.js";
import {
  uploadVideoToStorage,
  deleteVideoFromStorage,
} from "../services/storageService.js";

export const getVideos = catchAsyncError(async (req, res) => {
  const videos = await listVideos(req.user.id);
  res.json({ success: true, videos });
});

export const getVideo = catchAsyncError(async (req, res, next) => {
  const video = await getVideoById(req.user.id, req.params.id);
  if (!video) return next(new ErrorHandler("Video not found", 404));
  res.json({ success: true, video });
});

export const uploadVideoFile = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("Video file is required", 400));
  }

  const { title, description } = req.body;
  let uploaded = null;

  try {
    await assertVideoLimit(req.user.id);

    uploaded = await uploadVideoToStorage({
      userId: req.user.id,
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
    });

    const video = await createVideo(req.user.id, {
      title: title || req.file.originalname,
      description: description || null,
      source_type: "upload",
      file_url: uploaded.publicUrl,
      file_size: req.file.size,
      status: "ready",
      metadata: {
        storage_path: uploaded.storagePath,
        storage_bucket: uploaded.bucket,
      },
    });

    res.status(201).json({ success: true, video });
  } catch (error) {
    if (uploaded?.storagePath) {
      try {
        await deleteVideoFromStorage(uploaded.storagePath);
      } catch (cleanupError) {
        console.error("Failed to rollback uploaded video:", cleanupError.message);
      }
    }

    return next(
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(error.message || "Video upload failed", 400)
    );
  }
});

export const createVideoLink = catchAsyncError(async (req, res, next) => {
  const { title, description, source_type, source_url } = req.body;

  if (!source_url) {
    return next(new ErrorHandler("Source URL is required", 400));
  }

  const video = await createVideo(req.user.id, {
    title: title || "Untitled video",
    description: description || null,
    source_type: source_type || "url",
    source_url,
    status: "draft",
  });

  res.status(201).json({ success: true, video });
});

export const updateVideoDetails = catchAsyncError(async (req, res, next) => {
  const existing = await getVideoById(req.user.id, req.params.id);
  if (!existing) return next(new ErrorHandler("Video not found", 404));

  const allowed = ["title", "description", "status", "source_url", "source_type"];
  const payload = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) payload[key] = req.body[key];
  }

  const video = await updateVideo(req.user.id, req.params.id, payload);
  res.json({ success: true, video });
});

export const removeVideo = catchAsyncError(async (req, res, next) => {
  const existing = await getVideoById(req.user.id, req.params.id);
  if (!existing) return next(new ErrorHandler("Video not found", 404));

  await deleteVideo(req.user.id, req.params.id);
  res.json({ success: true, message: "Video deleted" });
});

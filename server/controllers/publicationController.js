import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import {
  listPublications,
  createPublication,
} from "../services/publicationService.js";

export const getPublications = catchAsyncError(async (req, res) => {
  const publications = await listPublications(req.user.id);
  res.json({ success: true, publications });
});

export const addPublication = catchAsyncError(async (req, res, next) => {
  const { video_id, platform, title, description, status, post_url } = req.body;

  if (!video_id || !platform) {
    return next(new ErrorHandler("video_id and platform are required", 400));
  }

  const validPlatforms = ["tiktok", "instagram", "facebook", "youtube"];
  if (!validPlatforms.includes(platform)) {
    return next(new ErrorHandler("Invalid platform", 400));
  }

  try {
    const publication = await createPublication(req.user.id, {
      video_id,
      platform,
      title,
      description,
      status,
      post_url,
    });
    res.status(201).json({ success: true, publication });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

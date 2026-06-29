import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PLATFORMS, SUPPORTED_LANGUAGES } from "../prompts/platformPrompts.js";
import { generatePlatformContent } from "../services/openaiService.js";
import {
  assertAiGenerationLimit,
  saveAiGeneration,
  listAiGenerations,
  getAiUsage,
} from "../services/aiGenerationService.js";
import {
  listPlatformContents,
  upsertPlatformContent,
  applyAiResultToPlatformContent,
} from "../services/platformContentService.js";
import { getVideoById } from "../services/videoService.js";

const GENERATION_TYPES = ["title", "description", "hashtags", "full_adaptation"];

export const generateContent = catchAsyncError(async (req, res, next) => {
  const { videoId, platform, generationType, language, productName, saveToVideo } =
    req.body;

  if (!videoId) return next(new ErrorHandler("videoId is required", 400));
  if (!platform || !PLATFORMS.includes(platform)) {
    return next(new ErrorHandler(`platform must be one of: ${PLATFORMS.join(", ")}`, 400));
  }
  if (!generationType || !GENERATION_TYPES.includes(generationType)) {
    return next(
      new ErrorHandler(
        `generationType must be one of: ${GENERATION_TYPES.join(", ")}`,
        400
      )
    );
  }

  const video = await getVideoById(req.user.id, videoId);
  if (!video) return next(new ErrorHandler("Video not found", 404));

  const langCode = language || "en";
  const supportedCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
  if (!supportedCodes.includes(langCode)) {
    return next(
      new ErrorHandler(`language must be one of: ${supportedCodes.join(", ")}`, 400)
    );
  }

  await assertAiGenerationLimit(req.user.id);

  let generation;
  try {
    const { result, model, tokensUsed, prompt } = await generatePlatformContent({
      platform,
      generationType,
      videoTitle: video.title,
      videoDescription: video.description,
      productName: productName || video.title,
      language: langCode,
    });

    generation = await saveAiGeneration(req.user.id, {
      videoId,
      platform,
      generationType,
      prompt,
      response: result,
      model,
      tokensUsed,
      status: "success",
    });

    let platformContent = null;
    if (saveToVideo !== false) {
      platformContent = await applyAiResultToPlatformContent(
        videoId,
        platform,
        result,
        generationType
      );
    }

    const usage = await getAiUsage(req.user.id);

    res.json({
      success: true,
      result,
      generation,
      platformContent,
      usage,
    });
  } catch (error) {
    await saveAiGeneration(req.user.id, {
      videoId,
      platform,
      generationType,
      status: "failed",
      errorMessage: error.message,
    }).catch(() => {});

    return next(
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(error.message || "AI generation failed", 500)
    );
  }
});

export const getGenerations = catchAsyncError(async (req, res) => {
  const { videoId, limit } = req.query;
  const generations = await listAiGenerations(req.user.id, {
    videoId,
    limit: limit ? Number(limit) : 50,
  });
  res.json({ success: true, generations });
});

export const getUsage = catchAsyncError(async (req, res) => {
  const usage = await getAiUsage(req.user.id);
  res.json({ success: true, usage });
});

export const getVideoPlatformContents = catchAsyncError(async (req, res, next) => {
  const video = await getVideoById(req.user.id, req.params.videoId);
  if (!video) return next(new ErrorHandler("Video not found", 404));

  const contents = await listPlatformContents(req.params.videoId);
  res.json({ success: true, contents });
});

export const saveVideoPlatformContent = catchAsyncError(async (req, res, next) => {
  const { platform } = req.params;
  if (!PLATFORMS.includes(platform)) {
    return next(new ErrorHandler(`platform must be one of: ${PLATFORMS.join(", ")}`, 400));
  }

  const video = await getVideoById(req.user.id, req.params.videoId);
  if (!video) return next(new ErrorHandler("Video not found", 404));

  const { title, description, hashtags, caption, status } = req.body;
  const content = await upsertPlatformContent(req.params.videoId, platform, {
    title,
    description,
    hashtags,
    caption,
    aiGenerated: false,
    status: status || "draft",
  });

  res.json({ success: true, content });
});

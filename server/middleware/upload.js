import multer from "multer";
import ErrorHandler from "../utils/errorHandler.js";

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ErrorHandler("Only MP4, WebM, MOV, and AVI videos are allowed", 400), false);
  }
};

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

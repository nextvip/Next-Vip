import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ErrorHandler from "../utils/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.join(__dirname, "../uploads/videos");

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userDir = path.join(uploadsRoot, req.user.id);
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

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

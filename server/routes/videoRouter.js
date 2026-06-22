import express from "express";
import { isAutheticated } from "../middleware/auth.js";
import { uploadVideo } from "../middleware/upload.js";
import {
  getVideos,
  getVideo,
  uploadVideoFile,
  createVideoLink,
  updateVideoDetails,
  removeVideo,
} from "../controllers/videoController.js";

const router = express.Router();

router.use(isAutheticated);

router.get("/", getVideos);
router.get("/:id", getVideo);
router.post("/upload", uploadVideo.single("video"), uploadVideoFile);
router.post("/link", createVideoLink);
router.put("/:id", updateVideoDetails);
router.delete("/:id", removeVideo);

export default router;

import express from "express";
import { isAutheticated } from "../middleware/auth.js";
import {
  generateContent,
  getGenerations,
  getUsage,
  getVideoPlatformContents,
  saveVideoPlatformContent,
} from "../controllers/aiController.js";

const router = express.Router();

router.use(isAutheticated);

router.post("/generate", generateContent);
router.get("/generations", getGenerations);
router.get("/usage", getUsage);
router.get("/videos/:videoId/platform-content", getVideoPlatformContents);
router.put("/videos/:videoId/platform-content/:platform", saveVideoPlatformContent);

export default router;

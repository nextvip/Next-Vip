import express from "express";
import { isAutheticated } from "../middleware/auth.js";
import {
  getPublications,
  addPublication,
} from "../controllers/publicationController.js";

const router = express.Router();

router.use(isAutheticated);

router.get("/", getPublications);
router.post("/", addPublication);

export default router;

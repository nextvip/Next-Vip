import express from "express";
import { isAutheticated } from "../middleware/auth.js";
import {
  getPlans,
  getMySubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/plans", getPlans);
router.get("/me", isAutheticated, getMySubscription);

export default router;

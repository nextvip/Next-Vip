import express from "express";
import { isAutheticated } from "../middleware/auth.js";
import {
  getTemplates,
  getTemplate,
  getTemplateDefaults,
  postTemplate,
  putTemplate,
  removeTemplate,
  previewTemplate,
  getRules,
  getRule,
  postRule,
  putRule,
  removeRule,
  getExecutions,
  testCommentTrigger,
} from "../controllers/automationController.js";

const router = express.Router();

router.use(isAutheticated);

router.get("/templates/defaults", getTemplateDefaults);
router.get("/templates", getTemplates);
router.post("/templates", postTemplate);
router.post("/templates/preview", previewTemplate);
router.get("/templates/:id", getTemplate);
router.put("/templates/:id", putTemplate);
router.delete("/templates/:id", removeTemplate);

router.get("/rules", getRules);
router.post("/rules", postRule);
router.get("/rules/:id", getRule);
router.put("/rules/:id", putRule);
router.delete("/rules/:id", removeRule);

router.get("/executions", getExecutions);
router.post("/test-comment", testCommentTrigger);

export default router;

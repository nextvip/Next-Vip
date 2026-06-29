import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import {
  listTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getDefaultTemplateContent,
} from "../services/automationTemplateService.js";
import {
  listRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
  listExecutions,
} from "../services/automationRuleService.js";
import {
  processCommentTrigger,
  previewAutomation,
} from "../services/automationEngineService.js";
import { TEMPLATE_VARIABLES } from "../services/templateVariableService.js";

// --- Templates ---

export const getTemplates = catchAsyncError(async (req, res) => {
  const templates = await listTemplates(req.user.id);
  res.json({ success: true, templates });
});

export const getTemplate = catchAsyncError(async (req, res, next) => {
  const template = await getTemplateById(req.user.id, req.params.id);
  if (!template) return next(new ErrorHandler("Template not found", 404));
  res.json({ success: true, template });
});

export const getTemplateDefaults = catchAsyncError(async (req, res) => {
  res.json({
    success: true,
    defaults: getDefaultTemplateContent(),
    variables: TEMPLATE_VARIABLES,
  });
});

export const postTemplate = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  if (!name?.trim()) return next(new ErrorHandler("Template name is required", 400));

  const template = await createTemplate(req.user.id, {
    name: name.trim(),
    videoId: req.body.videoId,
    triggerKeywords: req.body.triggerKeywords,
    publicReplyTemplate: req.body.publicReplyTemplate,
    privateDmTemplate: req.body.privateDmTemplate,
    customVariables: req.body.customVariables,
    affiliateProductId: req.body.affiliateProductId,
    isActive: req.body.isActive,
  });

  res.status(201).json({ success: true, template });
});

export const putTemplate = catchAsyncError(async (req, res, next) => {
  const existing = await getTemplateById(req.user.id, req.params.id);
  if (!existing) return next(new ErrorHandler("Template not found", 404));

  const template = await updateTemplate(req.user.id, req.params.id, {
    name: req.body.name,
    videoId: req.body.videoId,
    triggerKeywords: req.body.triggerKeywords,
    publicReplyTemplate: req.body.publicReplyTemplate,
    privateDmTemplate: req.body.privateDmTemplate,
    customVariables: req.body.customVariables,
    affiliateProductId: req.body.affiliateProductId,
    isActive: req.body.isActive,
  });

  res.json({ success: true, template });
});

export const removeTemplate = catchAsyncError(async (req, res, next) => {
  const existing = await getTemplateById(req.user.id, req.params.id);
  if (!existing) return next(new ErrorHandler("Template not found", 404));

  await deleteTemplate(req.user.id, req.params.id);
  res.json({ success: true, message: "Template deleted" });
});

export const previewTemplate = catchAsyncError(async (req, res, next) => {
  const { templateId, commentText, username, customVariables } = req.body;
  if (!templateId) return next(new ErrorHandler("templateId is required", 400));

  const preview = await previewAutomation(req.user.id, {
    templateId,
    commentText: commentText || "Precio",
    username,
    customVariables,
  });

  res.json({ success: true, preview });
});

// --- Rules ---

export const getRules = catchAsyncError(async (req, res) => {
  const rules = await listRules(req.user.id);
  res.json({ success: true, rules });
});

export const getRule = catchAsyncError(async (req, res, next) => {
  const rule = await getRuleById(req.user.id, req.params.id);
  if (!rule) return next(new ErrorHandler("Rule not found", 404));
  res.json({ success: true, rule });
});

export const postRule = catchAsyncError(async (req, res, next) => {
  const { name, templateId } = req.body;
  if (!name?.trim()) return next(new ErrorHandler("Rule name is required", 400));
  if (!templateId) return next(new ErrorHandler("templateId is required", 400));

  const rule = await createRule(req.user.id, {
    name: name.trim(),
    triggerType: req.body.triggerType || "keyword_comment",
    conditions: req.body.conditions || { keywords: ["*"], stop_after_match: true },
    actions: req.body.actions || { public_reply: true, send_dm: true },
    templateId,
    videoId: req.body.videoId,
    priority: req.body.priority,
    isActive: req.body.isActive,
  });

  res.status(201).json({ success: true, rule });
});

export const putRule = catchAsyncError(async (req, res, next) => {
  const existing = await getRuleById(req.user.id, req.params.id);
  if (!existing) return next(new ErrorHandler("Rule not found", 404));

  const rule = await updateRule(req.user.id, req.params.id, {
    name: req.body.name,
    triggerType: req.body.triggerType,
    conditions: req.body.conditions,
    actions: req.body.actions,
    templateId: req.body.templateId,
    videoId: req.body.videoId,
    priority: req.body.priority,
    isActive: req.body.isActive,
  });

  res.json({ success: true, rule });
});

export const removeRule = catchAsyncError(async (req, res, next) => {
  const existing = await getRuleById(req.user.id, req.params.id);
  if (!existing) return next(new ErrorHandler("Rule not found", 404));

  await deleteRule(req.user.id, req.params.id);
  res.json({ success: true, message: "Rule deleted" });
});

// --- Executions ---

export const getExecutions = catchAsyncError(async (req, res) => {
  const executions = await listExecutions(req.user.id, {
    videoId: req.query.videoId,
    limit: req.query.limit ? Number(req.query.limit) : 50,
  });
  res.json({ success: true, executions });
});

export const testCommentTrigger = catchAsyncError(async (req, res, next) => {
  const { commentText, username, platform, videoId, tiktokLink, amazonLink, whatsapp } =
    req.body;

  if (!commentText?.trim()) {
    return next(new ErrorHandler("commentText is required", 400));
  }

  const result = await processCommentTrigger(req.user.id, {
    commentText: commentText.trim(),
    username: username || "test_user",
    platform: platform || "instagram",
    videoId: videoId || null,
    tiktokLink,
    amazonLink,
    whatsapp,
    productName: req.body.productName,
  });

  res.json({
    success: true,
    matched: result.matched,
    rule: result.rule || null,
    template: result.template || null,
    execution: result.execution || null,
    note: "Public reply and DM are logged but not sent until Milestone 4 social APIs are connected.",
  });
});

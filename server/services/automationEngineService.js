import {
  commentMatchesKeywords,
  resolveTemplate,
} from "./templateVariableService.js";
import {
  getTemplateById,
  listTemplates,
} from "./automationTemplateService.js";
import { listRules, saveExecution } from "./automationRuleService.js";

const findTemplateForRule = async (userId, rule, context) => {
  if (rule.template_id) {
    return getTemplateById(userId, rule.template_id);
  }

  const templates = await listTemplates(userId);
  const active = templates.filter((t) => t.is_active);

  if (rule.video_id) {
    const videoTemplate = active.find((t) => t.video_id === rule.video_id);
    if (videoTemplate) return videoTemplate;
  }

  if (context.videoId) {
    const videoTemplate = active.find((t) => t.video_id === context.videoId);
    if (videoTemplate) return videoTemplate;
  }

  return active.find((t) => !t.video_id) || active[0] || null;
};

const buildVariables = (context, template) => {
  const custom = template?.custom_variables || {};
  return {
    username: context.username || "amigo",
    tiktok_link: custom.tiktok_link || context.tiktokLink || "",
    amazon_link: custom.amazon_link || context.amazonLink || "",
    whatsapp: custom.whatsapp || context.whatsapp || "",
    product: custom.product || context.productName || "",
    link: custom.link || context.primaryLink || custom.amazon_link || "",
  };
};

/**
 * Evaluate rules and execute actions. DM/public reply are stubbed until M4 Meta API.
 */
export const processCommentTrigger = async (userId, context) => {
  const rules = await listRules(userId);
  const sorted = rules
    .filter((r) => r.is_active && r.trigger_type === "keyword_comment")
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  for (const rule of sorted) {
    if (rule.video_id && context.videoId && rule.video_id !== context.videoId) {
      continue;
    }

    const platformFilter = rule.conditions?.platforms;
    if (
      platformFilter?.length &&
      context.platform &&
      !platformFilter.includes(context.platform)
    ) {
      continue;
    }

    const template = await findTemplateForRule(userId, rule, context);
    if (!template) {
      await saveExecution(userId, {
        ruleId: rule.id,
        triggerType: "keyword_comment",
        triggerData: context,
        status: "failed",
        errorMessage: "No active automation template found",
      });
      continue;
    }

    const keywords = rule.conditions?.keywords || template.trigger_keywords || ["*"];
    if (!commentMatchesKeywords(context.commentText, keywords)) {
      continue;
    }

    const variables = buildVariables(context, template);
    const publicReply = resolveTemplate(template.public_reply_template, variables);
    const dmText = resolveTemplate(template.private_dm_template, variables);

    const actions = rule.actions || {};
    const sendPublic = actions.public_reply !== false;
    const sendDm = actions.send_dm !== false;

    const execution = await saveExecution(userId, {
      ruleId: rule.id,
      templateId: template.id,
      videoId: context.videoId || rule.video_id || null,
      triggerType: "keyword_comment",
      triggerData: context,
      publicReplySent: sendPublic,
      publicReplyText: sendPublic ? publicReply : null,
      dmSent: sendDm,
      dmText: sendDm ? dmText : null,
      affiliateProductId: template.affiliate_product_id || null,
      affiliateLinkUsed: variables.amazon_link || variables.tiktok_link || null,
      status: "success",
    });

    if (rule.conditions?.stop_after_match !== false) {
      return { matched: true, rule, template, execution };
    }
  }

  return { matched: false };
};

export const previewAutomation = async (userId, { templateId, commentText, username, customVariables }) => {
  const template = await getTemplateById(userId, templateId);
  if (!template) {
    throw new Error("Template not found");
  }

  const keywords = template.trigger_keywords || ["*"];
  const matches = commentMatchesKeywords(commentText, keywords);

  const variables = {
    username: username || "usuario_ejemplo",
    tiktok_link: customVariables?.tiktok_link || "https://tiktok.com/example",
    amazon_link: customVariables?.amazon_link || "https://amazon.com/dp/example?tag=your-tag",
    whatsapp: customVariables?.whatsapp || "+1 570 241 4290",
    product: customVariables?.product || "Producto ejemplo",
    link: customVariables?.link || customVariables?.amazon_link || "https://example.com",
  };

  return {
    matches,
    publicReply: resolveTemplate(template.public_reply_template, variables),
    privateDm: resolveTemplate(template.private_dm_template, variables),
    variables,
  };
};

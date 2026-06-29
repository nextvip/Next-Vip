import { supabase } from "../config/supabase.js";
import { fromDbRow } from "../lib/rowMapper.js";
import { getUserPlan } from "./subscriptionService.js";
import ErrorHandler from "../utils/errorHandler.js";
import {
  DEFAULT_PRIVATE_DM,
  DEFAULT_PUBLIC_REPLY,
} from "./templateVariableService.js";

const mapTemplate = (row) => {
  if (!row) return null;
  const t = fromDbRow(row);
  t.trigger_keywords = row.trigger_keywords || [];
  t.public_reply_template = row.public_reply_template;
  t.private_dm_template = row.private_dm_template;
  t.custom_variables = row.custom_variables || {};
  t.video_id = row.video_id;
  t.affiliate_product_id = row.affiliate_product_id;
  t.is_active = row.is_active;
  return t;
};

export const listTemplates = async (userId) => {
  const { data, error } = await supabase
    .from("automation_templates")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(mapTemplate);
};

export const getTemplateById = async (userId, templateId) => {
  const { data, error } = await supabase
    .from("automation_templates")
    .select("*")
    .eq("id", templateId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return mapTemplate(data);
};

const countUserTemplates = async (userId) => {
  const { count, error } = await supabase
    .from("automation_templates")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return count || 0;
};

export const assertTemplateLimit = async (userId) => {
  const plan = await getUserPlan(userId);
  const limit = plan?.max_automations ?? plan?.maxAutomations ?? 0;
  if (!limit) return;

  const count = await countUserTemplates(userId);
  if (count >= limit) {
    throw new ErrorHandler(
      `Automation template limit reached (${limit}). Upgrade your plan.`,
      403
    );
  }
};

export const createTemplate = async (userId, payload) => {
  await assertTemplateLimit(userId);

  const { data, error } = await supabase
    .from("automation_templates")
    .insert({
      user_id: userId,
      name: payload.name,
      video_id: payload.videoId || null,
      trigger_keywords: payload.triggerKeywords || ["*"],
      public_reply_template: payload.publicReplyTemplate ?? DEFAULT_PUBLIC_REPLY,
      private_dm_template: payload.privateDmTemplate ?? DEFAULT_PRIVATE_DM,
      custom_variables: payload.customVariables || {},
      affiliate_product_id: payload.affiliateProductId || null,
      is_active: payload.isActive !== false,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapTemplate(data);
};

export const updateTemplate = async (userId, templateId, payload) => {
  const patch = { updated_at: new Date().toISOString() };
  if (payload.name !== undefined) patch.name = payload.name;
  if (payload.videoId !== undefined) patch.video_id = payload.videoId;
  if (payload.triggerKeywords !== undefined) patch.trigger_keywords = payload.triggerKeywords;
  if (payload.publicReplyTemplate !== undefined) {
    patch.public_reply_template = payload.publicReplyTemplate;
  }
  if (payload.privateDmTemplate !== undefined) patch.private_dm_template = payload.privateDmTemplate;
  if (payload.customVariables !== undefined) patch.custom_variables = payload.customVariables;
  if (payload.affiliateProductId !== undefined) {
    patch.affiliate_product_id = payload.affiliateProductId;
  }
  if (payload.isActive !== undefined) patch.is_active = payload.isActive;

  const { data, error } = await supabase
    .from("automation_templates")
    .update(patch)
    .eq("id", templateId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapTemplate(data);
};

export const deleteTemplate = async (userId, templateId) => {
  const { error } = await supabase
    .from("automation_templates")
    .delete()
    .eq("id", templateId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

export const getDefaultTemplateContent = () => ({
  publicReplyTemplate: DEFAULT_PUBLIC_REPLY,
  privateDmTemplate: DEFAULT_PRIVATE_DM,
  triggerKeywords: ["*"],
});

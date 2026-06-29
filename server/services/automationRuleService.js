import { supabase } from "../config/supabase.js";
import { fromDbRow } from "../lib/rowMapper.js";
import ErrorHandler from "../utils/errorHandler.js";

const mapRule = (row) => {
  if (!row) return null;
  const r = fromDbRow(row);
  r.trigger_type = row.trigger_type;
  r.conditions = row.conditions || {};
  r.actions = row.actions || {};
  r.template_id = row.template_id;
  r.video_id = row.video_id;
  r.priority = row.priority;
  r.is_active = row.is_active;
  return r;
};

export const listRules = async (userId) => {
  const { data, error } = await supabase
    .from("automation_rules")
    .select("*")
    .eq("user_id", userId)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(mapRule);
};

export const getRuleById = async (userId, ruleId) => {
  const { data, error } = await supabase
    .from("automation_rules")
    .select("*")
    .eq("id", ruleId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return mapRule(data);
};

export const createRule = async (userId, payload) => {
  const { data, error } = await supabase
    .from("automation_rules")
    .insert({
      user_id: userId,
      name: payload.name,
      trigger_type: payload.triggerType || "keyword_comment",
      conditions: payload.conditions || {},
      actions: payload.actions || { public_reply: true, send_dm: true },
      template_id: payload.templateId || null,
      video_id: payload.videoId || null,
      priority: payload.priority ?? 0,
      is_active: payload.isActive !== false,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRule(data);
};

export const updateRule = async (userId, ruleId, payload) => {
  const patch = { updated_at: new Date().toISOString() };
  if (payload.name !== undefined) patch.name = payload.name;
  if (payload.triggerType !== undefined) patch.trigger_type = payload.triggerType;
  if (payload.conditions !== undefined) patch.conditions = payload.conditions;
  if (payload.actions !== undefined) patch.actions = payload.actions;
  if (payload.templateId !== undefined) patch.template_id = payload.templateId;
  if (payload.videoId !== undefined) patch.video_id = payload.videoId;
  if (payload.priority !== undefined) patch.priority = payload.priority;
  if (payload.isActive !== undefined) patch.is_active = payload.isActive;

  const { data, error } = await supabase
    .from("automation_rules")
    .update(patch)
    .eq("id", ruleId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRule(data);
};

export const deleteRule = async (userId, ruleId) => {
  const { error } = await supabase
    .from("automation_rules")
    .delete()
    .eq("id", ruleId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

const mapExecution = (row) => {
  if (!row) return null;
  const e = fromDbRow(row);
  e.trigger_type = row.trigger_type;
  e.trigger_data = row.trigger_data || {};
  e.public_reply_sent = row.public_reply_sent;
  e.public_reply_text = row.public_reply_text;
  e.dm_sent = row.dm_sent;
  e.dm_text = row.dm_text;
  e.status = row.status;
  e.error_message = row.error_message;
  e.executed_at = row.executed_at;
  return e;
};

export const listExecutions = async (userId, { videoId, limit = 50 } = {}) => {
  let query = supabase
    .from("automation_executions")
    .select("*")
    .eq("user_id", userId)
    .order("executed_at", { ascending: false })
    .limit(limit);

  if (videoId) query = query.eq("video_id", videoId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).map(mapExecution);
};

export const saveExecution = async (userId, payload) => {
  const { data, error } = await supabase
    .from("automation_executions")
    .insert({
      user_id: userId,
      rule_id: payload.ruleId || null,
      template_id: payload.templateId || null,
      video_id: payload.videoId || null,
      comment_id: payload.commentId || null,
      trigger_type: payload.triggerType,
      trigger_data: payload.triggerData || {},
      public_reply_sent: payload.publicReplySent || false,
      public_reply_text: payload.publicReplyText || null,
      dm_sent: payload.dmSent || false,
      dm_text: payload.dmText || null,
      affiliate_product_id: payload.affiliateProductId || null,
      affiliate_link_used: payload.affiliateLinkUsed || null,
      status: payload.status || "success",
      error_message: payload.errorMessage || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapExecution(data);
};

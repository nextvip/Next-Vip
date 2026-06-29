import { supabase } from "../config/supabase.js";
import { fromDbRow } from "../lib/rowMapper.js";
import { getUserPlan } from "./subscriptionService.js";
import ErrorHandler from "../utils/errorHandler.js";

const mapGeneration = (row) => {
  if (!row) return null;
  const gen = fromDbRow(row);
  gen.generation_type = row.generation_type;
  gen.platform = row.platform;
  gen.video_id = row.video_id;
  gen.prompt = row.prompt;
  gen.response = row.response;
  gen.model = row.model;
  gen.tokens_used = row.tokens_used;
  gen.status = row.status;
  gen.error_message = row.error_message;
  return gen;
};

const monthStartIso = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
};

export const countMonthlyGenerations = async (userId) => {
  const { count, error } = await supabase
    .from("ai_generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "success")
    .gte("created_at", monthStartIso());

  if (error) throw new Error(error.message);
  return count || 0;
};

export const assertAiGenerationLimit = async (userId) => {
  const plan = await getUserPlan(userId);
  const limit = plan?.ai_generations_per_month ?? plan?.aiGenerationsPerMonth ?? 0;

  if (!limit || limit <= 0) return { used: 0, limit: 0 };

  const used = await countMonthlyGenerations(userId);
  if (used >= limit) {
    throw new ErrorHandler(
      `AI generation limit reached (${limit}/month). Upgrade your plan for more.`,
      403
    );
  }

  return { used, limit };
};

export const getAiUsage = async (userId) => {
  const plan = await getUserPlan(userId);
  const limit = plan?.ai_generations_per_month ?? plan?.aiGenerationsPerMonth ?? 0;
  const used = await countMonthlyGenerations(userId);
  return { used, limit, remaining: Math.max(0, limit - used) };
};

export const saveAiGeneration = async (userId, payload) => {
  const { data, error } = await supabase
    .from("ai_generations")
    .insert({
      user_id: userId,
      video_id: payload.videoId || null,
      platform: payload.platform || null,
      generation_type: payload.generationType,
      prompt: payload.prompt || null,
      response: payload.response || null,
      model: payload.model || null,
      tokens_used: payload.tokensUsed || 0,
      status: payload.status || "success",
      error_message: payload.errorMessage || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapGeneration(data);
};

export const listAiGenerations = async (userId, { videoId, limit = 50 } = {}) => {
  let query = supabase
    .from("ai_generations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (videoId) {
    query = query.eq("video_id", videoId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).map(mapGeneration);
};

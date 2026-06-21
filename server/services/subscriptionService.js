import { supabase } from "../config/supabase.js";
import { fromDbRow } from "../lib/rowMapper.js";

export const getActivePlans = async () => {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(fromDbRow);
};

export const getPlanBySlug = async (slug) => {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? fromDbRow(data) : null;
};

export const getUserPlan = async (userId) => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("current_plan_id")
    .eq("id", userId)
    .maybeSingle();

  if (userError) throw new Error(userError.message);

  if (!user?.current_plan_id) {
    return getPlanBySlug("free");
  }

  const { data: plan, error: planError } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", user.current_plan_id)
    .maybeSingle();

  if (planError) throw new Error(planError.message);
  return plan ? fromDbRow(plan) : getPlanBySlug("free");
};

export const assignFreePlanToUser = async (userId) => {
  const freePlan = await getPlanBySlug("free");
  if (!freePlan) return null;

  const { error } = await supabase
    .from("users")
    .update({ current_plan_id: freePlan.id })
    .eq("id", userId);

  if (error) throw new Error(error.message);
  return freePlan;
};

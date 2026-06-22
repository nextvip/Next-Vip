import catchAsyncError from "../middleware/catchAsyncErrors.js";
import {
  getActivePlans,
  getUserPlan,
} from "../services/subscriptionService.js";
import { countUserVideos } from "../services/videoService.js";
import { supabase } from "../config/supabase.js";

export const getPlans = catchAsyncError(async (_req, res) => {
  const plans = await getActivePlans();
  res.json({ success: true, plans });
});

export const getMySubscription = catchAsyncError(async (req, res) => {
  const plan = await getUserPlan(req.user.id);
  const videoCount = await countUserVideos(req.user.id);

  const { count: publicationCount } = await supabase
    .from("publications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", req.user.id);

  res.json({
    success: true,
    plan,
    usage: {
      videos: videoCount,
      publications: publicationCount || 0,
    },
  });
});

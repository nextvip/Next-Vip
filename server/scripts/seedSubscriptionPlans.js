import dotenv from "dotenv";
import SubscriptionPlan from "../models/subscriptionPlanModel.js";
import { supabase } from "../config/supabase.js";
import "../config/db.js";

dotenv.config();

const DEFAULT_PLANS = [
  {
    name: "Free Trial",
    slug: "free",
    description: "7 days free — 10 videos per day on all platforms",
    price_monthly: 0,
    price_yearly: 0,
    max_videos: 10,
    max_automations: 5,
    max_connected_accounts: 4,
    max_scheduled_posts: 10,
    ai_generations_per_month: 50,
    features: {
      duration_days: 7,
      videos_per_day: 10,
      all_platforms: true,
      comment_automation: true,
      dm_automation: true,
      affiliate_system: true,
      priority_support: false,
    },
    sort_order: 1,
    is_active: true,
  },
  {
    name: "Standard",
    slug: "standard",
    description: "15 days — 10 videos per day on all platforms",
    price_monthly: 40,
    price_yearly: 0,
    max_videos: 10,
    max_automations: 25,
    max_connected_accounts: 4,
    max_scheduled_posts: 50,
    ai_generations_per_month: 200,
    features: {
      duration_days: 15,
      videos_per_day: 10,
      all_platforms: true,
      comment_automation: true,
      dm_automation: true,
      affiliate_system: true,
      priority_support: false,
    },
    sort_order: 2,
    is_active: true,
  },
  {
    name: "Popular",
    slug: "popular",
    description: "30 days — 30 videos per day on all platforms",
    price_monthly: 59,
    price_yearly: 0,
    max_videos: 30,
    max_automations: 50,
    max_connected_accounts: 4,
    max_scheduled_posts: 100,
    ai_generations_per_month: 500,
    features: {
      duration_days: 30,
      videos_per_day: 30,
      all_platforms: true,
      comment_automation: true,
      dm_automation: true,
      affiliate_system: true,
      priority_support: true,
    },
    sort_order: 3,
    is_active: true,
  },
];

const LEGACY_SLUGS = ["pro", "business"];

const seedPlans = async () => {
  for (const plan of DEFAULT_PLANS) {
    await SubscriptionPlan.findOneAndUpdate({ slug: plan.slug }, plan, {
      upsert: true,
      new: true,
    });
    console.log(`Seeded plan: ${plan.name}`);
  }

  const { error } = await supabase
    .from("subscription_plans")
    .update({ is_active: false })
    .in("slug", LEGACY_SLUGS);

  if (error) {
    console.warn("Could not deactivate legacy plans:", error.message);
  } else {
    console.log("Deactivated legacy plans: pro, business");
  }

  console.log("Subscription plans seeded successfully.");
};

seedPlans().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});

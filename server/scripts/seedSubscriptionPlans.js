import dotenv from "dotenv";
import mongoose from "mongoose";
import SubscriptionPlan from "../models/subscriptionPlanModel.js";

dotenv.config();

const DEFAULT_PLANS = [
  {
    name: "Free",
    slug: "free",
    description: "Basic access with limited automations",
    price_monthly: 0,
    price_yearly: 0,
    max_videos: 5,
    max_automations: 2,
    max_connected_accounts: 1,
    max_scheduled_posts: 3,
    ai_generations_per_month: 10,
    features: {
      all_platforms: false,
      comment_automation: true,
      dm_automation: false,
      affiliate_system: true,
      priority_support: false,
    },
    sort_order: 1,
  },
  {
    name: "Pro",
    slug: "pro",
    description: "Full automation across all platforms",
    price_monthly: 29,
    price_yearly: 290,
    max_videos: 100,
    max_automations: 50,
    max_connected_accounts: 4,
    max_scheduled_posts: 100,
    ai_generations_per_month: 500,
    features: {
      all_platforms: true,
      comment_automation: true,
      dm_automation: true,
      affiliate_system: true,
      priority_support: false,
    },
    sort_order: 2,
  },
  {
    name: "Business",
    slug: "business",
    description: "Advanced features, higher limits, and priority support",
    price_monthly: 79,
    price_yearly: 790,
    max_videos: 0,
    max_automations: 0,
    max_connected_accounts: 0,
    max_scheduled_posts: 0,
    ai_generations_per_month: 0,
    features: {
      all_platforms: true,
      comment_automation: true,
      dm_automation: true,
      affiliate_system: true,
      priority_support: true,
      unlimited: true,
    },
    sort_order: 3,
  },
];

const seedPlans = async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    dbName: process.env.DB_NAME,
  });

  for (const plan of DEFAULT_PLANS) {
    await SubscriptionPlan.findOneAndUpdate({ slug: plan.slug }, plan, {
      upsert: true,
      new: true,
    });
    console.log(`Seeded plan: ${plan.name}`);
  }

  await mongoose.disconnect();
  console.log("Subscription plans seeded successfully.");
};

seedPlans().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});

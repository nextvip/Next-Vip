-- Deactivate legacy monthly plans (replaced by duration-based plans)
UPDATE subscription_plans SET is_active = false WHERE slug IN ('pro', 'business');

-- Upsert Free Trial
INSERT INTO subscription_plans (
  name, slug, description, price_monthly, price_yearly,
  max_videos, max_automations, max_connected_accounts, max_scheduled_posts,
  ai_generations_per_month, features, sort_order, is_active
) VALUES (
  'Free Trial', 'free', '7 days free — 10 videos per day on all platforms',
  0, 0, 10, 5, 4, 10, 50,
  '{"duration_days":7,"videos_per_day":10,"all_platforms":true,"comment_automation":true,"dm_automation":true,"affiliate_system":true,"priority_support":false}'::jsonb,
  1, true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  max_videos = EXCLUDED.max_videos,
  max_automations = EXCLUDED.max_automations,
  max_connected_accounts = EXCLUDED.max_connected_accounts,
  max_scheduled_posts = EXCLUDED.max_scheduled_posts,
  ai_generations_per_month = EXCLUDED.ai_generations_per_month,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Upsert Standard
INSERT INTO subscription_plans (
  name, slug, description, price_monthly, price_yearly,
  max_videos, max_automations, max_connected_accounts, max_scheduled_posts,
  ai_generations_per_month, features, sort_order, is_active
) VALUES (
  'Standard', 'standard', '15 days — 10 videos per day on all platforms',
  40, 0, 10, 25, 4, 50, 200,
  '{"duration_days":15,"videos_per_day":10,"all_platforms":true,"comment_automation":true,"dm_automation":true,"affiliate_system":true,"priority_support":false}'::jsonb,
  2, true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  max_videos = EXCLUDED.max_videos,
  max_automations = EXCLUDED.max_automations,
  max_connected_accounts = EXCLUDED.max_connected_accounts,
  max_scheduled_posts = EXCLUDED.max_scheduled_posts,
  ai_generations_per_month = EXCLUDED.ai_generations_per_month,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Upsert Popular
INSERT INTO subscription_plans (
  name, slug, description, price_monthly, price_yearly,
  max_videos, max_automations, max_connected_accounts, max_scheduled_posts,
  ai_generations_per_month, features, sort_order, is_active
) VALUES (
  'Popular', 'popular', '30 days — 30 videos per day on all platforms',
  59, 0, 30, 50, 4, 100, 500,
  '{"duration_days":30,"videos_per_day":30,"all_platforms":true,"comment_automation":true,"dm_automation":true,"affiliate_system":true,"priority_support":true}'::jsonb,
  3, true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  max_videos = EXCLUDED.max_videos,
  max_automations = EXCLUDED.max_automations,
  max_connected_accounts = EXCLUDED.max_connected_accounts,
  max_scheduled_posts = EXCLUDED.max_scheduled_posts,
  ai_generations_per_month = EXCLUDED.ai_generations_per_month,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

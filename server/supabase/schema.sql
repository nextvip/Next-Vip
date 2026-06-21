-- Run this in Supabase Dashboard → SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  admin_id UUID,
  slug TEXT,
  about_us TEXT,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  user_type TEXT NOT NULL DEFAULT 'user'
    CHECK (user_type IN ('user', 'admin', 'authenticator', 'moderator')),
  phone TEXT,
  profile_picture TEXT,
  cover_picture TEXT,
  country TEXT,
  stripe_customer_id TEXT,
  current_plan_id UUID,
  reset_password_token TEXT,
  reset_password_expire TIMESTAMPTZ,
  token TEXT,
  token_validity_in_minutes TEXT,
  token_expire BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0,
  price_yearly NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  max_videos INTEGER NOT NULL DEFAULT 0,
  max_automations INTEGER NOT NULL DEFAULT 0,
  max_connected_accounts INTEGER NOT NULL DEFAULT 0,
  max_scheduled_posts INTEGER NOT NULL DEFAULT 0,
  ai_generations_per_month INTEGER NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_current_plan_id_fkey;

ALTER TABLE users
  ADD CONSTRAINT users_current_plan_id_fkey
  FOREIGN KEY (current_plan_id) REFERENCES subscription_plans(id) ON DELETE SET NULL;

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'incomplete'
    CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly'
    CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status ON user_subscriptions(user_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_subscriptions_stripe ON user_subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Video folders
CREATE TABLE IF NOT EXISTS video_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES video_folders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_folders_user_parent ON video_folders(user_id, parent_id);

-- Videos
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  source_type TEXT NOT NULL DEFAULT 'upload'
    CHECK (source_type IN ('upload', 'tiktok_link', 'url')),
  file_url TEXT,
  source_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER CHECK (duration IS NULL OR duration >= 0),
  file_size BIGINT CHECK (file_size IS NULL OR file_size >= 0),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'ready', 'processing', 'published', 'failed')),
  folder_id UUID REFERENCES video_folders(id) ON DELETE SET NULL,
  default_affiliate_product_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_user_status ON videos(user_id, status);
CREATE INDEX IF NOT EXISTS idx_videos_user_folder ON videos(user_id, folder_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- Affiliate products
CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'other'
    CHECK (platform IN ('amazon', 'tiktok_shop', 'other')),
  product_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_products_user_active ON affiliate_products(user_id, is_active);

ALTER TABLE videos
  DROP CONSTRAINT IF EXISTS videos_default_affiliate_product_id_fkey;

ALTER TABLE videos
  ADD CONSTRAINT videos_default_affiliate_product_id_fkey
  FOREIGN KEY (default_affiliate_product_id) REFERENCES affiliate_products(id) ON DELETE SET NULL;

-- Video affiliate products (junction)
CREATE TABLE IF NOT EXISTS video_affiliate_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  affiliate_product_id UUID NOT NULL REFERENCES affiliate_products(id) ON DELETE CASCADE,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (video_id, affiliate_product_id)
);

CREATE INDEX IF NOT EXISTS idx_video_affiliate_products_video_default ON video_affiliate_products(video_id, is_default);

-- Connected social accounts
CREATE TABLE IF NOT EXISTS connected_social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'facebook', 'youtube')),
  platform_account_id TEXT NOT NULL,
  account_name TEXT,
  account_username TEXT,
  profile_image_url TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, platform, platform_account_id)
);

CREATE INDEX IF NOT EXISTS idx_connected_social_accounts_user_active ON connected_social_accounts(user_id, is_active);

-- Video platform content
CREATE TABLE IF NOT EXISTS video_platform_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'facebook', 'youtube')),
  title TEXT,
  description TEXT,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  caption TEXT,
  ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  ai_prompt_version TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'approved', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (video_id, platform)
);

-- Scheduled posts
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  target_platforms TEXT[] NOT NULL DEFAULT '{}',
  target_account_ids UUID[] NOT NULL DEFAULT '{}',
  automations_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'processing', 'completed', 'failed', 'canceled')),
  error_message TEXT,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_status ON scheduled_posts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_status ON scheduled_posts(scheduled_at, status);

-- Publications
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  connected_account_id UUID REFERENCES connected_social_accounts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'facebook', 'youtube')),
  platform_post_id TEXT,
  post_url TEXT,
  title TEXT,
  description TEXT,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'published', 'failed', 'deleted')),
  error_message TEXT,
  published_at TIMESTAMPTZ,
  scheduled_post_id UUID REFERENCES scheduled_posts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publications_user_video ON publications(user_id, video_id);
CREATE INDEX IF NOT EXISTS idx_publications_video_platform ON publications(video_id, platform);
CREATE UNIQUE INDEX IF NOT EXISTS idx_publications_platform_post ON publications(platform_post_id)
  WHERE platform_post_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_publications_published_at ON publications(published_at DESC);

-- Social comments
CREATE TABLE IF NOT EXISTS social_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'facebook', 'youtube')),
  platform_comment_id TEXT NOT NULL,
  author_username TEXT,
  author_platform_id TEXT,
  comment_text TEXT NOT NULL,
  parent_comment_id TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (platform, platform_comment_id)
);

CREATE INDEX IF NOT EXISTS idx_social_comments_publication_processed ON social_comments(publication_id, processed);
CREATE INDEX IF NOT EXISTS idx_social_comments_user_received ON social_comments(user_id, received_at DESC);

-- Automation templates
CREATE TABLE IF NOT EXISTS automation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  trigger_keywords TEXT[] NOT NULL DEFAULT '{}',
  public_reply_template TEXT,
  private_dm_template TEXT,
  custom_variables JSONB NOT NULL DEFAULT '{}'::jsonb,
  affiliate_product_id UUID REFERENCES affiliate_products(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_templates_user_active ON automation_templates(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_automation_templates_user_video ON automation_templates(user_id, video_id);

-- Automation rules
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL
    CHECK (trigger_type IN ('keyword_comment', 'video_uploaded', 'published_on_platform')),
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  actions JSONB NOT NULL DEFAULT '{}'::jsonb,
  template_id UUID REFERENCES automation_templates(id) ON DELETE SET NULL,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_rules_user_active_priority ON automation_rules(user_id, is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_automation_rules_user_trigger ON automation_rules(user_id, trigger_type);

-- Automation executions
CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES automation_rules(id) ON DELETE SET NULL,
  template_id UUID REFERENCES automation_templates(id) ON DELETE SET NULL,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  comment_id UUID REFERENCES social_comments(id) ON DELETE SET NULL,
  trigger_type TEXT NOT NULL,
  trigger_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  public_reply_sent BOOLEAN NOT NULL DEFAULT FALSE,
  public_reply_text TEXT,
  dm_sent BOOLEAN NOT NULL DEFAULT FALSE,
  dm_text TEXT,
  affiliate_product_id UUID REFERENCES affiliate_products(id) ON DELETE SET NULL,
  affiliate_link_used TEXT,
  status TEXT NOT NULL DEFAULT 'success'
    CHECK (status IN ('success', 'partial', 'failed')),
  error_message TEXT,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_executions_user_executed ON automation_executions(user_id, executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_executions_rule ON automation_executions(rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_comment ON automation_executions(comment_id)
  WHERE comment_id IS NOT NULL;

-- AI generations
CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  platform TEXT CHECK (platform IN ('tiktok', 'instagram', 'facebook', 'youtube')),
  generation_type TEXT NOT NULL
    CHECK (generation_type IN ('title', 'description', 'hashtags', 'reply', 'full_adaptation')),
  prompt TEXT,
  response JSONB,
  model TEXT,
  tokens_used INTEGER NOT NULL DEFAULT 0 CHECK (tokens_used >= 0),
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_generations_user_created ON ai_generations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_generations_video ON ai_generations(video_id);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('paid', 'failed', 'refunded', 'pending')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_created ON payment_transactions(user_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_transactions_stripe_invoice ON payment_transactions(stripe_invoice_id)
  WHERE stripe_invoice_id IS NOT NULL;

-- Webhook events
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('stripe', 'tiktok', 'meta', 'youtube')),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_source_processed ON webhook_events(source, processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'users', 'subscription_plans', 'user_subscriptions', 'video_folders', 'videos',
    'affiliate_products', 'video_affiliate_products', 'connected_social_accounts',
    'video_platform_contents', 'scheduled_posts', 'publications', 'social_comments',
    'automation_templates', 'automation_rules', 'automation_executions', 'ai_generations',
    'payment_transactions', 'webhook_events'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I', table_name, table_name);
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      table_name,
      table_name
    );
  END LOOP;
END $$;

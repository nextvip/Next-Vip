-- Run in Supabase SQL Editor if you already applied an older schema.sql
ALTER TABLE publications
  ALTER COLUMN connected_account_id DROP NOT NULL;

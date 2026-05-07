-- Adds reply support to post_comments via a self-referential parent_id.
-- Run after post_comments.sql. One-level deep: replies to replies attach to the same top-level parent at the application layer.

ALTER TABLE post_comments
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES post_comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS post_comments_parent_id_idx ON post_comments(parent_id);

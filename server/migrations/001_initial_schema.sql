CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  title TEXT,
  genre TEXT NOT NULL CHECK (char_length(trim(genre)) > 0),
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'generating'
    CHECK (status IN ('generating', 'completed', 'failed')),
  saved BOOLEAN NOT NULL DEFAULT TRUE,
  request_description TEXT NOT NULL CHECK (char_length(trim(request_description)) > 0),
  request_child_name TEXT,
  request_age_range TEXT,
  request_length TEXT,
  request_characters TEXT,
  request_lesson TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, id)
);

CREATE INDEX stories_session_saved_created_at_index
  ON stories (session_id, saved, created_at DESC);

CREATE TABLE story_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL CHECK (page_number > 0),
  content TEXT NOT NULL CHECK (char_length(trim(content)) > 0),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (story_id, page_number)
);

CREATE TABLE reading_progress (
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  story_id UUID NOT NULL,
  current_page INTEGER NOT NULL CHECK (current_page > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (session_id, story_id),
  FOREIGN KEY (session_id, story_id)
    REFERENCES stories(session_id, id) ON DELETE CASCADE
);

CREATE TABLE idempotency_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  key TEXT NOT NULL CHECK (char_length(trim(key)) > 0),
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, key)
);

CREATE INDEX idempotency_keys_expires_at_index
  ON idempotency_keys (expires_at);

CREATE TYPE idempotency_status AS ENUM (
  'in_progress',
  'succeeded',
  'failed'
);

ALTER TABLE story_pages
  ADD COLUMN image_alt_text TEXT;

ALTER TABLE idempotency_keys
  ADD COLUMN request_hash CHAR(64);

-- Existing idempotency rows predate request-payload hashing. Give them a
-- deterministic legacy value so future reuse of the same key is treated as a
-- conflict rather than incorrectly matching an unknown original request.
UPDATE idempotency_keys
SET request_hash = encode(
  digest('legacy:' || id::TEXT, 'sha256'),
  'hex'
)
WHERE request_hash IS NULL;

ALTER TABLE idempotency_keys
  ALTER COLUMN request_hash SET NOT NULL;

ALTER TABLE idempotency_keys
  ADD COLUMN status idempotency_status;

UPDATE idempotency_keys
SET status = CASE
  WHEN story_id IS NULL THEN 'failed'::idempotency_status
  ELSE 'succeeded'::idempotency_status
END
WHERE status IS NULL;

ALTER TABLE idempotency_keys
  ALTER COLUMN status SET DEFAULT 'in_progress';

ALTER TABLE idempotency_keys
  ALTER COLUMN status SET NOT NULL;

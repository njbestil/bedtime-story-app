ALTER TABLE stories
  ADD COLUMN cover_image_url TEXT,
  ADD COLUMN cover_image_alt_text TEXT,
  ADD CONSTRAINT stories_cover_image_pair_check
    CHECK (
      (cover_image_url IS NULL AND cover_image_alt_text IS NULL)
      OR (
        char_length(trim(cover_image_url)) > 0
        AND char_length(trim(cover_image_alt_text)) > 0
      )
    );

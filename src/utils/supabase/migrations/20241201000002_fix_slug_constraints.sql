-- Fix slug constraints and ensure proper handling
-- This migration addresses potential issues with slug uniqueness

-- Drop the existing unique index if it exists
DROP INDEX IF EXISTS designs_slug_idx;

-- Recreate the unique index with proper handling of NULL values
CREATE UNIQUE INDEX designs_slug_idx ON designs(slug) WHERE slug IS NOT NULL AND slug != '';

-- Add a check constraint to ensure slugs are not empty strings
ALTER TABLE designs DROP CONSTRAINT IF EXISTS designs_slug_not_empty;
ALTER TABLE designs ADD CONSTRAINT designs_slug_not_empty CHECK (slug IS NULL OR slug != '');

-- Update any existing empty string slugs to NULL
UPDATE designs SET slug = NULL WHERE slug = '';

-- Ensure all designs have slugs (if they have names)
UPDATE designs 
SET slug = ensure_unique_slug(generate_slug(name), id)
WHERE slug IS NULL AND name IS NOT NULL AND name != '';

-- Add comment to document the constraint
COMMENT ON CONSTRAINT designs_slug_not_empty ON designs IS 'Ensures slugs are either NULL or non-empty strings'; 
-- Add slug column to designs table
ALTER TABLE designs
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create a unique index on slug for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS designs_slug_idx ON designs(slug) WHERE slug IS NOT NULL;

-- Add comment on the column
COMMENT ON COLUMN designs.slug IS 'URL-friendly slug for the design name, used for preview URLs';

-- Function to generate a slug from a name
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Convert to lowercase, replace spaces and special characters with hyphens
  RETURN lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Function to ensure unique slug
CREATE OR REPLACE FUNCTION ensure_unique_slug(base_slug TEXT, design_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  final_slug := base_slug;
  
  -- Keep trying until we find a unique slug
  WHILE EXISTS (
    SELECT 1 FROM designs 
    WHERE slug = final_slug 
    AND (design_id IS NULL OR id != design_id)
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql; 
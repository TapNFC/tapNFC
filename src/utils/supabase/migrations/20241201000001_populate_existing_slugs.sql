-- Populate slugs for existing designs that don't have them
-- This migration should be run after the slug column is added

-- Function to generate a slug from a name (if not already defined)
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

-- Update existing designs to have slugs
UPDATE designs 
SET slug = ensure_unique_slug(generate_slug(name), id)
WHERE slug IS NULL OR slug = '';

-- Add a comment to document this migration
COMMENT ON FUNCTION generate_slug(TEXT) IS 'Generates a URL-friendly slug from a design name';
COMMENT ON FUNCTION ensure_unique_slug(TEXT, UUID) IS 'Ensures a slug is unique by appending a number if necessary'; 
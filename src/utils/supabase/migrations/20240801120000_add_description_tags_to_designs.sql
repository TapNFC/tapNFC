-- Add description and tags columns to the designs table
ALTER TABLE designs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE designs ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add comments to the new columns
COMMENT ON COLUMN designs.description IS 'Description of the design.';
COMMENT ON COLUMN designs.tags IS 'Array of tags associated with the design.'; 
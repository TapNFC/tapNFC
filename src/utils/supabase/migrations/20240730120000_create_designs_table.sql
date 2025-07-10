-- Create a table for designs
CREATE TABLE designs (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  canvas_data JSONB,
  preview_url TEXT,
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comments to the table and columns
COMMENT ON TABLE designs IS 'Stores design templates and user-created designs.';
COMMENT ON COLUMN designs.id IS 'Unique identifier for each design.';
COMMENT ON COLUMN designs.user_id IS 'Foreign key to the user who owns the design.';
COMMENT ON COLUMN designs.name IS 'The name of the design.';
COMMENT ON COLUMN designs.description IS 'Description of the design.';
COMMENT ON COLUMN designs.tags IS 'Array of tags associated with the design.';
COMMENT ON COLUMN designs.canvas_data IS 'JSONB data representing the state of the design canvas (e.g., Fabric.js data).';
COMMENT ON COLUMN designs.preview_url IS 'URL for a preview image of the design.';
COMMENT ON COLUMN designs.is_template IS 'Flag to indicate if the design is a pre-made template.';
COMMENT ON COLUMN designs.is_public IS 'Flag to indicate if the design is publicly accessible.';
COMMENT ON COLUMN designs.created_at IS 'Timestamp of when the design was created.';
COMMENT ON COLUMN designs.updated_at IS 'Timestamp of when the design was last updated.';

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updated_at timestamp on any change
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON designs
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- 1. Users can see their own designs
CREATE POLICY "Users can view their own designs" ON designs
FOR SELECT USING (auth.uid() = user_id);

-- 2. Users can see public designs
CREATE POLICY "Users can view public designs" ON designs
FOR SELECT USING (is_public = TRUE);

-- 3. Users can insert their own designs
CREATE POLICY "Users can create their own designs" ON designs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Users can update their own designs
CREATE POLICY "Users can update their own designs" ON designs
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Users can delete their own designs
CREATE POLICY "Users can delete their own designs" ON designs
FOR DELETE USING (auth.uid() = user_id); 
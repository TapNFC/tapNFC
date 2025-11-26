-- Add qr_code_url column to designs table
ALTER TABLE designs
ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- Comment on the column
COMMENT ON COLUMN designs.qr_code_url IS 'URL to the saved QR code image in Supabase storage'; 
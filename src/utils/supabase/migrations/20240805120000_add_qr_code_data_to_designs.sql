-- Add qr_code_data column to designs table
ALTER TABLE designs
ADD COLUMN IF NOT EXISTS qr_code_data TEXT;

-- Comment on the column
COMMENT ON COLUMN designs.qr_code_data IS 'SVG data for the QR code (base64 or serialized SVG) for multi-resolution downloads'; 
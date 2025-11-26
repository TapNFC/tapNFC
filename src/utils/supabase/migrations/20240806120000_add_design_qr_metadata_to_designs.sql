-- Add design_qr_metadata column to designs table
-- This column stores QR code styling settings and metadata as JSONB
ALTER TABLE designs
ADD COLUMN IF NOT EXISTS design_qr_metadata JSONB;

-- Comment on the column
COMMENT ON COLUMN designs.design_qr_metadata IS 'JSONB data containing QR code styling settings and metadata (size, color, logo, style, etc.) for preserving user preferences when regenerating QR codes';

-- Create an index for better query performance on the JSONB column
CREATE INDEX IF NOT EXISTS idx_designs_qr_metadata ON designs USING GIN (design_qr_metadata);

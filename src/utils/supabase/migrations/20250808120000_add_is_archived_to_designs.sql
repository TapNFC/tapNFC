-- Add is_archived flag to designs table
ALTER TABLE designs
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN designs.is_archived IS 'Flag to indicate if the design (and its QR code) is archived and should not be scannable.';
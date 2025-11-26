-- Create QR code scans table
CREATE TABLE IF NOT EXISTS qr_code_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  country_code TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for faster queries
  CONSTRAINT fk_design FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE
);

-- Create index on design_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_qr_code_scans_design_id ON qr_code_scans(design_id);
CREATE INDEX IF NOT EXISTS idx_qr_code_scans_created_at ON qr_code_scans(created_at);

-- Create RLS policies
ALTER TABLE qr_code_scans ENABLE ROW LEVEL SECURITY;

-- Allow users to view scans for their designs
CREATE POLICY "Users can view scans for their designs" ON qr_code_scans
  FOR SELECT
  USING (
    design_id IN (
      SELECT id FROM designs WHERE user_id = auth.uid()
    )
  );

-- Allow authenticated users to create scans
CREATE POLICY "Anyone can create scans" ON qr_code_scans
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Create function to increment scan count
CREATE OR REPLACE FUNCTION increment_qr_code_scan()
RETURNS TRIGGER AS $$
BEGIN
  -- In the future, we could update a counter in the designs table
  -- For now, we'll just use COUNT queries
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to increment scan count
CREATE TRIGGER after_qr_code_scan_insert
  AFTER INSERT ON qr_code_scans
  FOR EACH ROW
  EXECUTE FUNCTION increment_qr_code_scan(); 
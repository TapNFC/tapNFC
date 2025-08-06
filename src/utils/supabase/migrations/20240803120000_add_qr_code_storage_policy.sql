-- Create storage policy for QR code uploads
CREATE POLICY "Allow authenticated uploads to QR codes" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'designs' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'qr-codes'
);

-- Create policy for public access to QR codes
CREATE POLICY "Allow public access to QR codes" 
ON storage.objects 
FOR SELECT 
TO anon, authenticated
USING (
  bucket_id = 'designs' AND 
  (storage.foldername(name))[1] = 'qr-codes'
);

-- Create policy for users to update their own QR codes
CREATE POLICY "Allow users to update their own QR codes" 
ON storage.objects 
FOR UPDATE 
TO authenticated
WITH CHECK (
  bucket_id = 'designs' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'qr-codes'
);

-- Create policy for users to delete their own QR codes
CREATE POLICY "Allow users to delete their own QR codes" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'designs' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'qr-codes'
); 
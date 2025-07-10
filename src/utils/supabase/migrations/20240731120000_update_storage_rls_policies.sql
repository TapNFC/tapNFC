-- Create a new schema for private functions
CREATE SCHEMA IF NOT EXISTS private;

-- Function to check if the current user is the owner of a given design.
-- This function is created with SECURITY DEFINER, meaning it runs with the permissions
-- of the user who created it. This allows it to bypass RLS on the public.designs table
-- for the specific purpose of checking ownership.
CREATE OR REPLACE FUNCTION private.user_is_design_owner(design_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
-- Set a secure search path to prevent hijacking.
SET search_path = public
AS $$
  SELECT auth.uid() = d.user_id
  FROM public.designs d
  WHERE d.id = design_id;
$$;

-- Remove old policies if they exist, to prevent conflicts.
DROP POLICY IF EXISTS "Allow design owners to upload preview images" ON storage.objects;
DROP POLICY IF EXISTS "Allow design owners to update preview images" ON storage.objects;
DROP POLICY IF EXISTS "Allow design owners to delete preview images" ON storage.objects;
DROP POLICY IF EXISTS "Allow design owners to view preview images" ON storage.objects;

-- RLS Policy for Inserting new preview images
-- This policy allows an authenticated user to insert an object (image) into the 'designs' bucket
-- if the user_is_design_owner function returns true for the design ID parsed from the file path.
CREATE POLICY "Allow design owners to upload preview images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'designs'
  AND private.user_is_design_owner(((string_to_array(name, '/'))[2])::uuid)
);

-- RLS Policy for Selecting preview images
CREATE POLICY "Allow design owners to view preview images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'designs'
  AND private.user_is_design_owner(((string_to_array(name, '/'))[2]:uuid)
);

-- RLS Policy for Updating preview images
CREATE POLICY "Allow design owners to update preview images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'designs'
  AND private.user_is_design_owner(((string_to_array(name, '/'))[2])::uuid)
)
WITH CHECK (
  bucket_id = 'designs'
  AND private.user_is_design_owner(((string_to_array(name, '/'))[2])::uuid)
);

-- RLS Policy for Deleting preview images
CREATE POLICY "Allow design owners to delete preview images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'designs'
  AND private.user_is_design_owner(((string_to_array(name, '/'))[2])::uuid)
); 
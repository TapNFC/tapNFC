import type { CustomerFormData, DbCustomer } from '@/types/customer';
import { createClient } from '@/utils/supabase/client';
import { storageService } from './storageService';

const supabase = createClient();

export async function getCustomers(): Promise<DbCustomer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function addCustomer(customerData: CustomerFormData): Promise<DbCustomer> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication Error: You must be logged in to add a customer.');
  }

  // Handle image upload if a new avatar is provided
  if (customerData.avatar_url && customerData.avatar_url.startsWith('data:image')) {
    customerData.avatar_url = await storageService.uploadCustomerLogo(customerData.avatar_url, user.id);
  }

  const submissionData = Object.fromEntries(
    Object.entries(customerData).map(([key, value]) => [key, value === '' ? null : value]),
  );

  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert({ ...submissionData, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error adding customer:', error);
    if (submissionData.avatar_url) {
      await storageService.deleteCustomerLogo(submissionData.avatar_url as string);
    }
    throw new Error(error.message);
  }

  return newCustomer;
}

export async function addMultipleCustomers(
  customersData: CustomerFormData[],
): Promise<DbCustomer[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication Error: You must be logged in to add customers.');
  }

  const submissions = customersData.map((customerData) => {
    const submissionData = Object.fromEntries(
      Object.entries(customerData).map(([key, value]) => [key, value === '' ? null : value]),
    );
    return { ...submissionData, user_id: user.id };
  });

  const { data: newCustomers, error } = await supabase
    .from('customers')
    .insert(submissions)
    .select();

  if (error) {
    console.error('Error adding multiple customers:', error);
    throw new Error(error.message);
  }

  return newCustomers || [];
}

export async function updateCustomer(
  customerId: string,
  customerData: CustomerFormData,
): Promise<DbCustomer> {
  // 1. Get the current customer record to check for an existing logo
  const { data: existingCustomer, error: fetchError } = await supabase
    .from('customers')
    .select('avatar_url')
    .eq('id', customerId)
    .single();

  if (fetchError) {
    console.error('Error fetching existing customer for update:', fetchError);
    throw new Error('Could not verify existing customer before update.');
  }

  const oldAvatarUrl = existingCustomer?.avatar_url;
  let newAvatarUrl = customerData.avatar_url;

  // 2. Check if the avatar has changed
  const isNewImageUploaded = newAvatarUrl && newAvatarUrl.startsWith('data:image');
  const isImageRemoved = oldAvatarUrl && !newAvatarUrl;

  // 3. If there's a new image, upload it
  if (isNewImageUploaded) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication Error: You must be logged in to update a customer.');
    }
    newAvatarUrl = await storageService.uploadCustomerLogo(newAvatarUrl as string, user.id);
    customerData.avatar_url = newAvatarUrl;
  }

  // 4. If image has changed or been removed, delete the old one
  if (oldAvatarUrl && (isNewImageUploaded || isImageRemoved)) {
    await storageService.deleteCustomerLogo(oldAvatarUrl);
  }

  // 5. Prepare and update the database record
  const submissionData = Object.fromEntries(
    Object.entries(customerData).map(([key, value]) => [key, value === '' ? null : value]),
  );

  const { data: updatedCustomer, error: updateError } = await supabase
    .from('customers')
    .update(submissionData)
    .eq('id', customerId)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating customer:', updateError);
    // If the DB update fails but we uploaded a new image, roll back the upload.
    if (isNewImageUploaded && newAvatarUrl) {
      await storageService.deleteCustomerLogo(newAvatarUrl);
    }
    throw new Error(updateError.message);
  }

  return updatedCustomer;
}

export async function deleteCustomer(customerId: string): Promise<void> {
  const { data: existingCustomer, error: fetchError } = await supabase
    .from('customers')
    .select('avatar_url')
    .eq('id', customerId)
    .single();

  if (fetchError) {
    console.error('Error fetching customer for deletion:', fetchError);
    // Continue with deletion even if we can't fetch the avatar_url
  }

  const { error } = await supabase.from('customers').delete().eq('id', customerId);

  if (error) {
    console.error('Error deleting customer:', error);
    throw new Error(error.message);
  }

  if (existingCustomer?.avatar_url) {
    await storageService.deleteCustomerLogo(existingCustomer.avatar_url);
  }
}

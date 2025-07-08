import type { CustomerFormData, DbCustomer } from '@/types/customer';
import { createClient } from '@/utils/supabase/client';

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
  const submissionData = Object.fromEntries(
    Object.entries(customerData).map(([key, value]) => [key, value === '' ? null : value]),
  );

  const { data: updatedCustomer, error } = await supabase
    .from('customers')
    .update(submissionData)
    .eq('id', customerId)
    .select()
    .single();

  if (error) {
    console.error('Error updating customer:', error);
    throw new Error(error.message);
  }

  return updatedCustomer;
}

export async function deleteCustomer(customerId: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', customerId);

  if (error) {
    console.error('Error deleting customer:', error);
    throw new Error(error.message);
  }
}

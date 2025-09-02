'use client';

import type { CustomerFormData } from '@/types/customer';
import { useCustomersQuery } from './useCustomersQuery';

export const useCustomersWithQuery = () => {
  const {
    customers,
    isLoading,
    error,
    addCustomer: addCustomerMutation,
    addMultipleCustomers: addMultipleCustomersMutation,
    updateCustomer: updateCustomerMutation,
    deleteCustomer: deleteCustomerMutation,
  } = useCustomersQuery();

  const addCustomer = async (customerData: CustomerFormData) => {
    return addCustomerMutation(customerData);
  };

  const addMultipleCustomers = async (customersData: CustomerFormData[]) => {
    return addMultipleCustomersMutation(customersData);
  };

  const updateCustomer = async (customerId: string, customerData: CustomerFormData) => {
    return updateCustomerMutation({ customerId, customerData });
  };

  const deleteCustomer = async (customerId: string, customerName: string) => {
    return deleteCustomerMutation({ customerId, customerName });
  };

  return {
    customers,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addMultipleCustomers,
  };
};

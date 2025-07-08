'use client';

import type { Customer, CustomerFormData } from '@/types/customer';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  addCustomer as apiAddCustomer,
  addMultipleCustomers as apiAddMultipleCustomers,
  deleteCustomer as apiDeleteCustomer,
  getCustomers as apiGetCustomers,
  updateCustomer as apiUpdateCustomer,
} from '@/services/customerService';
import { mapDbToDisplay } from '@/utils/customerUtils';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dbCustomers = await apiGetCustomers();
      setCustomers(mapDbToDisplay(dbCustomers));
    } catch (e: any) {
      setError(e.message);
      toast.error('Failed to fetch customers', { description: e.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const addCustomer = async (customerData: CustomerFormData) => {
    try {
      const newDbCustomer = await apiAddCustomer(customerData);
      const [newCustomer] = mapDbToDisplay([newDbCustomer]);

      if (newCustomer) {
        setCustomers(prev => [newCustomer, ...prev]);
        toast.success(`Customer "${newCustomer.name}" has been added.`);
      }

      return newDbCustomer;
    } catch (e: any) {
      toast.error('Error adding customer', { description: e.message });
      throw e;
    }
  };

  const addMultipleCustomers = async (customersData: CustomerFormData[]) => {
    try {
      const newDbCustomers = await apiAddMultipleCustomers(customersData);
      const newCustomers = mapDbToDisplay(newDbCustomers);
      setCustomers(prev => [...newCustomers, ...prev]);
      toast.success(`${newCustomers.length} customers have been added.`);
      return newDbCustomers;
    } catch (e: any) {
      toast.error('Error adding multiple customers', {
        description: e.message,
      });
      throw e;
    }
  };

  const updateCustomer = async (
    customerId: string,
    customerData: CustomerFormData,
  ) => {
    try {
      const updatedDbCustomer = await apiUpdateCustomer(
        customerId,
        customerData,
      );
      const [updatedCustomer] = mapDbToDisplay([updatedDbCustomer]);

      if (updatedCustomer) {
        setCustomers(prev =>
          prev.map(c =>
            c.id === updatedCustomer.id ? updatedCustomer : c,
          ),
        );
        toast.success(`Customer "${updatedCustomer.name}" has been updated.`);
      }
      return updatedDbCustomer;
    } catch (e: any) {
      toast.error('Error updating customer', { description: e.message });
      throw e;
    }
  };

  const deleteCustomer = async (customerId: string, customerName: string) => {
    try {
      await apiDeleteCustomer(customerId);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      toast.success(`Customer "${customerName}" has been deleted.`);
    } catch (e: any) {
      toast.error('Failed to delete customer', { description: e.message });
      throw e;
    }
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
}

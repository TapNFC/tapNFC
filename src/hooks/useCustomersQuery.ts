import type { Customer, CustomerFormData } from '@/types/customer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  addCustomer as apiAddCustomer,
  addMultipleCustomers as apiAddMultipleCustomers,
  deleteCustomer as apiDeleteCustomer,
  getCustomers as apiGetCustomers,
  updateCustomer as apiUpdateCustomer,
} from '@/services/customerService';
import { mapDbToDisplay } from '@/utils/customerUtils';

// Fetch customers data
const fetchCustomersData = async (): Promise<Customer[]> => {
  const dbCustomers = await apiGetCustomers();
  return mapDbToDisplay(dbCustomers);
};

export const useCustomersQuery = () => {
  const queryClient = useQueryClient();

  // Query for customers data
  const {
    data: customers = [],
    isLoading,
    error,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomersData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for adding a single customer
  const addCustomerMutation = useMutation({
    mutationFn: async (customerData: CustomerFormData) => {
      const newDbCustomer = await apiAddCustomer(customerData);
      return newDbCustomer;
    },
    onSuccess: (newDbCustomer) => {
      // Update the cache with the new customer
      queryClient.setQueryData(['customers'], (oldData: Customer[] | undefined) => {
        if (!oldData) {
          return oldData;
        }
        const [newCustomer] = mapDbToDisplay([newDbCustomer]);
        return [newCustomer, ...oldData];
      });

      const [newCustomer] = mapDbToDisplay([newDbCustomer]);
      if (newCustomer) {
        toast.success(`Customer "${newCustomer.name}" has been added.`);
      }
    },
    onError: (error: any) => {
      toast.error('Error adding customer', { description: error.message });
    },
  });

  // Mutation for adding multiple customers
  const addMultipleCustomersMutation = useMutation({
    mutationFn: async (customersData: CustomerFormData[]) => {
      const newDbCustomers = await apiAddMultipleCustomers(customersData);
      return newDbCustomers;
    },
    onSuccess: (newDbCustomers) => {
      // Update the cache with the new customers
      queryClient.setQueryData(['customers'], (oldData: Customer[] | undefined) => {
        if (!oldData) {
          return oldData;
        }
        const newCustomers = mapDbToDisplay(newDbCustomers);
        return [...newCustomers, ...oldData];
      });

      const newCustomers = mapDbToDisplay(newDbCustomers);
      toast.success(`${newCustomers.length} customers have been added.`);
    },
    onError: (error: any) => {
      toast.error('Error adding multiple customers', { description: error.message });
    },
  });

  // Mutation for updating a customer
  const updateCustomerMutation = useMutation({
    mutationFn: async ({ customerId, customerData }: { customerId: string; customerData: CustomerFormData }) => {
      const updatedDbCustomer = await apiUpdateCustomer(customerId, customerData);
      return { customerId, updatedDbCustomer };
    },
    onSuccess: ({ customerId, updatedDbCustomer }) => {
      // Update the cache with the updated customer
      queryClient.setQueryData(['customers'], (oldData: Customer[] | undefined) => {
        if (!oldData) {
          return oldData;
        }
        const [updatedCustomer] = mapDbToDisplay([updatedDbCustomer]);
        return oldData.map(c => c.id === customerId ? updatedCustomer : c);
      });

      const [updatedCustomer] = mapDbToDisplay([updatedDbCustomer]);
      if (updatedCustomer) {
        toast.success(`Customer "${updatedCustomer.name}" has been updated.`);
      }
    },
    onError: (error: any) => {
      toast.error('Error updating customer', { description: error.message });
    },
  });

  // Mutation for deleting a customer
  const deleteCustomerMutation = useMutation({
    mutationFn: async ({ customerId, customerName }: { customerId: string; customerName: string }) => {
      await apiDeleteCustomer(customerId);
      return { customerId, customerName };
    },
    onSuccess: ({ customerId, customerName }) => {
      // Remove the customer from the cache
      queryClient.setQueryData(['customers'], (oldData: Customer[] | undefined) => {
        if (!oldData) {
          return oldData;
        }
        return oldData.filter(c => c.id !== customerId);
      });

      toast.success(`Customer "${customerName}" has been deleted.`);
    },
    onError: (error: any) => {
      toast.error('Failed to delete customer', { description: error.message });
    },
  });

  return {
    customers,
    isLoading,
    error,
    refetchCustomers,
    addCustomer: addCustomerMutation.mutate,
    addMultipleCustomers: addMultipleCustomersMutation.mutate,
    updateCustomer: updateCustomerMutation.mutate,
    deleteCustomer: deleteCustomerMutation.mutate,
    isAddingCustomer: addCustomerMutation.isPending,
    isAddingMultipleCustomers: addMultipleCustomersMutation.isPending,
    isUpdatingCustomer: updateCustomerMutation.isPending,
    isDeletingCustomer: deleteCustomerMutation.isPending,
  };
};

'use client';

import type { CustomerFormData } from '@/types/customer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageUpload } from '@/components/customers/ImageUpload';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { customerSchema } from '@/types/customer';

type AddCustomerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (customerData: CustomerFormData) => Promise<void>;
};

export function AddCustomerDialog({ open, onOpenChange, onAdd }: AddCustomerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      website: '',
      avatar_url: '',
      status: 'Active',
      brand_color: '#3B82F6',
      linkedin_url: '',
      twitter_url: '',
      instagram_url: '',
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      await onAdd(data);
      handleClose();
    } catch {
      // Error is already handled by the hook, but you could add specific UI feedback here if needed.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="size-5" />
            <span>Add New Customer</span>
          </DialogTitle>
          <DialogDescription>
            Create a new customer profile with company details and branding.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="mb-4 flex items-center space-x-2 text-lg font-medium">
                <div className="size-2 rounded-full bg-green-500" />
                <span>Basic Information</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corporation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@acme.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1-555-123-4567" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional contact phone number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://acme.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Company website URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 flex items-center space-x-2 text-lg font-medium">
                <div className="size-2 rounded-full bg-yellow-500" />
                <span>Company Logo</span>
              </h3>
              <FormField
                control={form.control}
                name="avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a logo for the company (e.g., PNG, JPG, max 5MB).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            {/* Status & Branding */}
            <Card className="p-6">
              <h3 className="mb-4 flex items-center space-x-2 text-lg font-medium">
                <div className="size-2 rounded-full bg-blue-500" />
                <span>Status & Branding</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the customer's initial status
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-3">
                          <Input
                            placeholder="#3B82F6"
                            {...field}
                            value={field.value ?? ''}
                            className="font-mono"
                          />
                          <div
                            className="size-10 rounded-lg border-2 border-slate-200 dark:border-slate-700"
                            style={{
                              backgroundColor: field.value || '#3B82F6',
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Hex color code for branding
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="mb-4 flex items-center space-x-2 text-lg font-medium">
                <div className="size-2 rounded-full bg-purple-500" />
                <span>Social Media Links</span>
              </h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/company/acme" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/acme" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/acme" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
              >
                {isSubmitting
                  ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Creating...
                      </>
                    )
                  : (
                      <>
                        <Plus className="mr-2 size-4" />
                        Add Customer
                      </>
                    )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

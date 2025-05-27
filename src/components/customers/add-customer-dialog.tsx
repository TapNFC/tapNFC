'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

const customerSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  brandColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format (use #RRGGBB)').optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
});

type CustomerFormData = z.infer<typeof customerSchema>;

type AddCustomerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (customer: CustomerFormData) => void;
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
      brandColor: '#3B82F6',
      linkedin: '',
      twitter: '',
      instagram: '',
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clean up empty optional fields
    const cleanedData = {
      ...data,
      phone: data.phone || undefined,
      website: data.website || undefined,
      brandColor: data.brandColor || '#3B82F6',
      linkedin: data.linkedin || undefined,
      twitter: data.twitter || undefined,
      instagram: data.instagram || undefined,
    };

    onAdd(cleanedData);
    setIsSubmitting(false);
    onOpenChange(false);
    form.reset();
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
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
            Create a new customer profile with unique QR code assignment.
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

            {/* Branding */}
            <Card className="p-6">
              <h3 className="mb-4 flex items-center space-x-2 text-lg font-medium">
                <div className="size-2 rounded-full bg-blue-500" />
                <span>Branding</span>
              </h3>

              <FormField
                control={form.control}
                name="brandColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-3">
                        <Input
                          placeholder="#3B82F6"
                          {...field}
                          className="font-mono"
                        />
                        <div
                          className="size-10 rounded-lg border-2 border-slate-200 dark:border-slate-700"
                          style={{ backgroundColor: field.value || '#3B82F6' }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Hex color code for brand customization (e.g., #3B82F6)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                  name="linkedin"
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
                  name="twitter"
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
                  name="instagram"
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

            {/* QR Code Info */}
            <Card className="border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/20">
              <div className="flex items-center space-x-3">
                <Plus className="size-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Unique QR Code Assignment
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    A unique QR code will be automatically generated for this customer profile
                  </p>
                </div>
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

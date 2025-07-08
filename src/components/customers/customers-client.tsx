'use client';

import type { CSVCustomer, Customer, CustomerFormData } from '@/types/customer';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Edit,
  Eye,
  FileDown,
  Globe,
  Grid,
  Instagram,
  Linkedin,
  List,
  Phone,
  Plus,
  QrCode,
  Search,
  Trash2,
  Twitter,
  Users,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { CSVUploadDialog } from '@/components/customers/csv-upload-dialog';
import { DeleteCustomerDialog } from '@/components/customers/delete-customer-dialog';
import { EditCustomerDialog } from '@/components/customers/edit-customer-dialog';
import { ViewCustomerDialog } from '@/components/customers/view-customer-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCustomers } from '@/hooks/useCustomers';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

export function CustomersClient() {
  const {
    customers,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addMultipleCustomers,
  } = useCustomers();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setAddOpen] = useState(false);
  const [isCsvUploadOpen, setCsvUploadOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    let result = customers;

    if (searchTerm) {
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
          || c.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredCustomers(result);
  }, [customers, searchTerm]);

  const handleAdd = async (data: CustomerFormData) => {
    await addCustomer(data);
    setAddOpen(false);
  };

  const handleCsvUpload = async (csvData: CSVCustomer[]) => {
    const customersToCreate: CustomerFormData[] = csvData.map(c => ({
      name: c.name,
      email: c.email,
      phone: c.phone,
      website: c.website,
      status: (c.status as 'Active' | 'Inactive') || 'Active',
      brand_color: c.brandColor,
      linkedin_url: c.linkedin,
      twitter_url: c.twitter,
      instagram_url: c.instagram,
    }));
    await addMultipleCustomers(customersToCreate);
  };

  const handleUpdate = async (id: string, data: CustomerFormData) => {
    await updateCustomer(id, data);
    setSelectedCustomer(null);
    setEditOpen(false);
  };

  const handleDeleteConfirm = async (
    customerId: string,
    customerName: string,
  ) => {
    await deleteCustomer(customerId, customerName);
    setSelectedCustomer(null);
    setDeleteOpen(false);
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditOpen(true);
  };

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  };

  const openViewDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewOpen(true);
  };

  const getInitials = (name: string) => {
    if (!name) {
      return '??';
    }
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-center">
            <div className="size-8 animate-spin rounded-full border-y-2 border-emerald-500" />
          </div>
          <div className="text-sm text-slate-500">Loading customer data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading customers:</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const totalCustomers = customers.length;
  const withWebsite = customers.filter(c => c.website).length;
  const withSocials = customers.filter(
    c =>
      c.socialLinks.linkedin
      || c.socialLinks.twitter
      || c.socialLinks.instagram,
  ).length;

  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: <Users className="size-4" />,
      color: 'bg-blue-500',
    },
    {
      title: 'With Website',
      value: withWebsite,
      icon: <Globe className="size-4" />,
      color: 'bg-emerald-500',
    },
    {
      title: 'With Socials',
      value: withSocials,
      icon: <Linkedin className="size-4" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-full space-y-6 p-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-500 p-2 shadow">
              <Users className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Customer Profiles
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage customer profiles with unique QR codes
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCsvUploadOpen(true)}
              className="h-9 gap-1.5 px-3 text-xs"
            >
              <FileDown className="size-3.5" />
              Import CSV
            </Button>
            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
              className="h-9 gap-1.5 bg-emerald-500 px-3 text-xs hover:bg-emerald-600"
            >
              <Plus className="size-3.5" />
              New Customer
            </Button>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="relative rounded-lg border border-slate-200/60 bg-white/80 p-3 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-slate-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </span>
                </div>
                <div className={`${stat.color} rounded-md p-2 text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 md:flex-nowrap">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-9 border-slate-200 pl-9 text-sm dark:border-slate-700"
              />
            </div>
          </div>
          <div className="flex h-9 items-center rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                'h-full rounded-none px-2.5',
                viewMode === 'grid'
                  ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                  : '',
              )}
            >
              <Grid className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(
                'h-full rounded-none px-2.5',
                viewMode === 'list'
                  ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                  : '',
              )}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'grid gap-4',
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1',
            )}
          >
            {filteredCustomers.map(customer => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: filteredCustomers.indexOf(customer) * 0.05,
                }}
                className="group"
              >
                {viewMode === 'grid'
                  ? (
                      <CustomerCard
                        customer={customer}
                        onView={() => openViewDialog(customer)}
                        onEdit={() => openEditDialog(customer)}
                        onDelete={() => openDeleteDialog(customer)}
                        getInitials={getInitials}
                      />
                    )
                  : (
                      <CustomerRow
                        customer={customer}
                        onView={() => openViewDialog(customer)}
                        onEdit={() => openEditDialog(customer)}
                        onDelete={() => openDeleteDialog(customer)}
                        getInitials={getInitials}
                      />
                    )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        {filteredCustomers.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 text-center"
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Users className="size-6 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              No customers found
            </h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Adjust your search or add a new customer
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCsvUploadOpen(true)}
              >
                <FileDown className="mr-1.5 size-3.5" />
                Import CSV
              </Button>
              <Button
                size="sm"
                onClick={() => setAddOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="mr-1.5 size-3.5" />
                New Customer
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <CSVUploadDialog
        open={isCsvUploadOpen}
        onOpenChange={setCsvUploadOpen}
        onUpload={handleCsvUpload}
      />
      <AddCustomerDialog
        open={isAddOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAdd}
      />
      <ViewCustomerDialog
        open={isViewOpen}
        onOpenChange={setViewOpen}
        customer={selectedCustomer}
      />
      <EditCustomerDialog
        open={isEditOpen}
        onOpenChange={setEditOpen}
        customer={selectedCustomer}
        onUpdate={handleUpdate}
      />
      <DeleteCustomerDialog
        open={isDeleteOpen}
        customer={selectedCustomer}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

type CustomerCardProps = {
  customer: Customer;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getInitials: (name: string) => string;
};

function CustomerCard({
  customer,
  onView,
  onEdit,
  onDelete,
  getInitials,
}: CustomerCardProps) {
  return (
    <Card className="overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/90">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar className="size-10 border-2 border-white shadow-sm">
              <AvatarImage src={customer.logo || undefined} />
              <AvatarFallback
                className="text-sm font-medium text-white"
                style={{ backgroundColor: customer.brandColor || '#3B82F6' }}
              >
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">
                {customer.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {customer.email}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <QrCode className="size-3.5" />
              <span className="font-mono">{customer.qrCodeId}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-1">
                <Phone className="size-3.5" />
                <span className="hidden xl:inline">{customer.phone}</span>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 border-t border-slate-200/60 pt-2 dark:border-slate-700/60">
            {customer.website && (
              <a
                href={customer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-emerald-500"
              >
                <Globe className="size-4" />
              </a>
            )}
            {customer.socialLinks.linkedin && (
              <a
                href={customer.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-blue-600"
              >
                <Linkedin className="size-4" />
              </a>
            )}
            {customer.socialLinks.twitter && (
              <a
                href={customer.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-sky-500"
              >
                <Twitter className="size-4" />
              </a>
            )}
            {customer.socialLinks.instagram && (
              <a
                href={customer.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-pink-500"
              >
                <Instagram className="size-4" />
              </a>
            )}
          </div>
          <div className="mt-2 flex gap-1.5 border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 flex-1 justify-center gap-1 text-xs"
              onClick={onView}
            >
              <Eye className="size-3.5" />
              <span>View</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 flex-1 justify-center gap-1 text-xs"
              onClick={onEdit}
            >
              <Edit className="size-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="size-8 text-red-500/90 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:text-red-500/70 dark:hover:text-red-500"
              onClick={onDelete}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

type CustomerRowProps = {
  customer: Customer;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getInitials: (name: string) => string;
};

function CustomerRow({
  customer,
  onView,
  onEdit,
  onDelete,
  getInitials,
}: CustomerRowProps) {
  return (
    <Card className="overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/90">
      <div className="flex items-center p-3">
        <Avatar className="mr-3 size-10 border-2 border-white shadow-sm">
          <AvatarImage src={customer.logo || undefined} />
          <AvatarFallback
            className="text-sm font-medium text-white"
            style={{ backgroundColor: customer.brandColor || '#3B82F6' }}
          >
            {getInitials(customer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <div>
              <h3 className="truncate font-medium text-slate-900 dark:text-white">
                {customer.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{customer.email}</span>
                <div className="flex items-center gap-1">
                  <QrCode className="size-3.5" />
                  <span className="font-mono">{customer.qrCodeId}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-2 border-l border-slate-200/60 pl-2 dark:border-slate-700/60">
                {customer.website && (
                  <a
                    href={customer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 transition-colors hover:text-emerald-500"
                  >
                    <Globe className="size-3.5" />
                  </a>
                )}
                {customer.socialLinks.linkedin && (
                  <a
                    href={customer.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 transition-colors hover:text-blue-600"
                  >
                    <Linkedin className="size-3.5" />
                  </a>
                )}
                {customer.socialLinks.twitter && (
                  <a
                    href={customer.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 transition-colors hover:text-sky-500"
                  >
                    <Twitter className="size-3.5" />
                  </a>
                )}
                {customer.socialLinks.instagram && (
                  <a
                    href={customer.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 transition-colors hover:text-pink-500"
                  >
                    <Instagram className="size-3.5" />
                  </a>
                )}
              </div>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={onView}
                >
                  <Eye className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={onEdit}
                >
                  <Edit className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-red-500/90 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:text-red-500/70 dark:hover:text-red-500"
                  onClick={onDelete}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

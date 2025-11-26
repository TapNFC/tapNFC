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
import { useCustomersWithQuery } from '@/hooks/useCustomersWithQuery';
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
  } = useCustomersWithQuery();

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
          <p className="text-sm">{error?.message || 'An error occurred'}</p>
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Card className="h-full overflow-hidden rounded-xl bg-white/60 shadow-md backdrop-blur-sm transition-all duration-300 ease-in-out hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-800/60">
        <div
          className="relative h-24"
          style={{ backgroundColor: customer.brandColor || '#475569' }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
        </div>

        <div className="relative p-5">
          <div className="absolute -top-12 left-1/2 flex -translate-x-1/2 justify-center">
            <Avatar className="size-20 rounded-full border-4 border-white shadow-lg dark:border-slate-800">
              <AvatarImage
                src={customer.logo ?? undefined}
                alt={customer.name}
                className="object-cover"
              />
              <AvatarFallback
                className="text-2xl font-semibold text-white"
                style={{ backgroundColor: customer.brandColor ?? '#3B82F6' }}
              >
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-10 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {customer.name}
            </h3>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              {customer.email}
            </p>

            <div className="mb-4 flex w-full items-center justify-around rounded-lg bg-slate-100/80 p-2 text-xs dark:bg-slate-700/80">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'size-2 rounded-full',
                    customer.status === 'Active'
                      ? 'bg-emerald-500'
                      : 'bg-slate-400',
                  )}
                />
                <span>{customer.status}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <QrCode className="size-3.5" />
                <span className="font-mono">{customer.qrCodeId}</span>
              </div>
            </div>

            <div className="flex h-8 items-center justify-center gap-3">
              {customer.website && (
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-emerald-500"
                  aria-label="Website"
                >
                  <Globe className="size-5" />
                </a>
              )}
              {customer.socialLinks.linkedin && (
                <a
                  href={customer.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-blue-600"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-5" />
                </a>
              )}
              {customer.socialLinks.twitter && (
                <a
                  href={customer.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-sky-500"
                  aria-label="Twitter"
                >
                  <Twitter className="size-5" />
                </a>
              )}
              {customer.socialLinks.instagram && (
                <a
                  href={customer.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-pink-500"
                  aria-label="Instagram"
                >
                  <Instagram className="size-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-lg backdrop-blur-sm dark:bg-slate-800/70">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-20 justify-center gap-1 text-xs"
              onClick={onView}
            >
              <Eye className="size-3.5" />
              <span>View</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-20 justify-center gap-1 text-xs"
              onClick={onEdit}
            >
              <Edit className="size-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-red-500/80 transition-colors hover:bg-red-500/10 hover:text-red-500"
              onClick={onDelete}
              aria-label="Delete"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
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
    <Card className="group grid grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
      <div className="col-span-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-10 shrink-0 rounded-lg border-2 border-white shadow-sm dark:border-slate-700">
            <AvatarImage
              src={customer.logo ?? undefined}
              alt={customer.name}
              className="object-contain"
            />
            <AvatarFallback
              className="rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: customer.brandColor ?? '#3B82F6' }}
            >
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-semibold text-slate-900 dark:text-white">
              {customer.name}
            </div>
            <div className="truncate text-xs text-slate-500 dark:text-slate-400">
              {customer.email}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            customer.status === 'Active'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
          )}
        >
          <span
            className={cn(
              'size-2 shrink-0 rounded-full',
              customer.status === 'Active'
                ? 'bg-emerald-500'
                : 'bg-slate-400',
            )}
          />
          <span className="truncate">{customer.status}</span>
        </div>
      </div>
      <div className="col-span-3">
        <div className="flex items-center justify-center gap-3">
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
      </div>
      <div className="col-span-3 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onView}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onEdit}
          >
            <Edit className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-red-500/80 hover:bg-red-500/10 hover:text-red-500"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

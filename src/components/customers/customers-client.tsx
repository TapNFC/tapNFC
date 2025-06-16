'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Edit,
  Eye,
  FileText,
  Grid3X3,
  List,
  Phone,
  Plus,
  QrCode,
  Search,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { CSVUploadDialog } from '@/components/customers/csv-upload-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  logo?: string;
  brandColor: string;
  website?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  qrCodeId: string;
  qrCodeUrl: string;
  createdAt: any;
  lastUpdated: any;
  status: 'Active' | 'Inactive' | 'Draft';
};

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    logo: '',
    brandColor: '#3B82F6',
    website: 'https://acme.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/acme',
      twitter: 'https://twitter.com/acme',
    },
    qrCodeId: 'QR-ACM-001',
    qrCodeUrl: 'https://qr.studio/acme-001',
    createdAt: '2024-01-15',
    lastUpdated: '2024-01-20',
    status: 'Active',
  },
  {
    id: '2',
    name: 'TechStart Inc',
    email: 'hello@techstart.io',
    phone: '+1 (555) 987-6543',
    logo: '',
    brandColor: '#10B981',
    website: 'https://techstart.io',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techstart',
      instagram: 'https://instagram.com/techstart',
    },
    qrCodeId: 'QR-TSI-002',
    qrCodeUrl: 'https://qr.studio/techstart-002',
    createdAt: '2024-01-12',
    lastUpdated: '2024-01-18',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Creative Studio',
    email: 'info@creativestudio.com',
    logo: '',
    brandColor: '#8B5CF6',
    website: 'https://creativestudio.com',
    socialLinks: {
      instagram: 'https://instagram.com/creativestudio',
      twitter: 'https://twitter.com/creativestudio',
    },
    qrCodeId: 'QR-CRS-003',
    qrCodeUrl: 'https://qr.studio/creative-003',
    createdAt: '2024-01-10',
    lastUpdated: '2024-01-15',
    status: 'Draft',
  },
  {
    id: '4',
    name: 'Global Retail Co',
    email: 'support@globalretail.com',
    phone: '+1 (555) 456-7890',
    logo: '',
    brandColor: '#F59E0B',
    website: 'https://globalretail.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/globalretail',
    },
    qrCodeId: 'QR-GRC-004',
    qrCodeUrl: 'https://qr.studio/globalretail-004',
    createdAt: '2024-01-08',
    lastUpdated: '2024-01-12',
    status: 'Inactive',
  },
  {
    id: '5',
    name: 'Local Bistro',
    email: 'orders@localbistro.com',
    phone: '+1 (555) 321-0987',
    logo: '',
    brandColor: '#EF4444',
    website: 'https://localbistro.com',
    socialLinks: {
      instagram: 'https://instagram.com/localbistro',
    },
    qrCodeId: 'QR-LBS-005',
    qrCodeUrl: 'https://qr.studio/localbistro-005',
    createdAt: '2024-01-05',
    lastUpdated: '2024-01-22',
    status: 'Active',
  },
];

const statusColors = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  Draft: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const filterOptions = [
  { id: 'all', label: 'All Customers', count: 5 },
  { id: 'active', label: 'Active', count: 3 },
  { id: 'inactive', label: 'Inactive', count: 1 },
  { id: 'draft', label: 'Draft', count: 1 },
];

export function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);

  const generateUniqueQRCode = () => {
    const prefix = 'QR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase())
      || customer.email.toLowerCase().includes(query.toLowerCase())
      || customer.qrCodeId.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredCustomers(filtered);
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    let filtered = customers;

    switch (filterId) {
      case 'active':
        filtered = customers.filter(customer => customer.status === 'Active');
        break;
      case 'inactive':
        filtered = customers.filter(customer => customer.status === 'Inactive');
        break;
      case 'draft':
        filtered = customers.filter(customer => customer.status === 'Draft');
        break;
      default:
        filtered = customers;
    }

    setFilteredCustomers(filtered);
  };

  const handleCSVUpload = (csvCustomers: any[]) => {
    const newCustomers: Customer[] = csvCustomers.map((csvCustomer: any, index: number) => {
      const qrCodeId = generateUniqueQRCode();
      const currentDate = new Date().toISOString().split('T')[0];
      return {
        id: (customers.length + index + 1).toString(),
        name: csvCustomer.name,
        email: csvCustomer.email,
        phone: csvCustomer.phone,
        logo: '',
        brandColor: csvCustomer.brandColor || '#3B82F6',
        website: csvCustomer.website,
        socialLinks: {
          linkedin: csvCustomer.linkedin,
          twitter: csvCustomer.twitter,
          instagram: csvCustomer.instagram,
        },
        qrCodeId,
        qrCodeUrl: `https://qr.studio/${qrCodeId.toLowerCase()}`,
        createdAt: currentDate,
        lastUpdated: currentDate,
        status: 'Active' as const,
      };
    });

    const updatedCustomers = [...customers, ...newCustomers];
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
  };

  const handleAddCustomer = (customerData: any) => {
    const qrCodeId = generateUniqueQRCode();
    const currentDate = new Date().toISOString().split('T')[0];
    const newCustomer: Customer = {
      id: (customers.length + 1).toString(),
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      logo: '',
      brandColor: customerData.brandColor || '#3B82F6',
      website: customerData.website,
      socialLinks: {
        linkedin: customerData.linkedin,
        twitter: customerData.twitter,
        instagram: customerData.instagram,
      },
      qrCodeId,
      qrCodeUrl: `https://qr.studio/${qrCodeId.toLowerCase()}`,
      createdAt: currentDate,
      lastUpdated: currentDate,
      status: 'Active',
    };

    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const totalQRCodes = customers.length; // Each customer has a unique QR code
  const draftCustomers = customers.filter(c => c.status === 'Draft').length;

  return (
    <div className="min-h-full space-y-6 p-6">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
      </div>

      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {/* Header with Title & Actions */}
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
              <Upload className="size-3.5" />
              Import CSV
            </Button>
            <Button
              size="sm"
              onClick={() => setAddCustomerOpen(true)}
              className="h-9 gap-1.5 bg-emerald-500 px-3 text-xs hover:bg-emerald-600"
            >
              <Plus className="size-3.5" />
              New Customer
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              title: 'Total Customers',
              value: totalCustomers,
              icon: <Users className="size-4" />,
              color: 'bg-emerald-500',
            },
            {
              title: 'Active Profiles',
              value: activeCustomers,
              icon: <Eye className="size-4" />,
              color: 'bg-blue-500',
            },
            {
              title: 'Total QR Codes',
              value: totalQRCodes,
              icon: <QrCode className="size-4" />,
              color: 'bg-purple-500',
            },
            {
              title: 'Draft Profiles',
              value: draftCustomers,
              icon: <FileText className="size-4" />,
              color: 'bg-orange-500',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="relative rounded-lg border border-slate-200/60 bg-white/80 p-3 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-slate-900 dark:text-white">{stat.value}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{stat.title}</span>
                </div>
                <div className={`${stat.color} rounded-md p-2 text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters Combined Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 md:flex-nowrap">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="h-9 border-slate-200 pl-9 text-sm dark:border-slate-700"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {filterOptions.map(filter => (
                <Button
                  key={filter.id}
                  size="sm"
                  variant={selectedFilter === filter.id ? 'primary' : 'secondary'}
                  onClick={() => handleFilterChange(filter.id)}
                  className={cn(
                    'h-9 px-3 text-xs whitespace-nowrap',
                    selectedFilter === filter.id && 'bg-emerald-500 hover:bg-emerald-600',
                  )}
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-1.5 text-[10px]">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex h-9 items-center rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                'h-full rounded-none px-2.5',
                viewMode === 'grid' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200' : '',
              )}
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(
                'h-full rounded-none px-2.5',
                viewMode === 'list' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200' : '',
              )}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Customers Grid */}
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
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1',
            )}
          >
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="group"
              >
                {viewMode === 'grid'
                  ? (
                      <Card className="overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/90">
                        <div className="p-4">
                          {/* Header with Avatar and Status */}
                          <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                              <Avatar className="size-10 border-2 border-white shadow-sm">
                                <AvatarImage src={customer.logo} />
                                <AvatarFallback
                                  className="text-sm font-medium text-white"
                                  style={{ backgroundColor: customer.brandColor }}
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
                            <Badge className={statusColors[customer.status]}>
                              {customer.status}
                            </Badge>
                          </div>

                          {/* Contact & QR Info */}
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <QrCode className="size-3.5" />
                                <span className="font-mono">{customer.qrCodeId}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {customer.phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="size-3.5" />
                                    <span className="hidden xl:inline">{customer.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-2 flex gap-1.5 border-t pt-3">
                              <Button variant="ghost" size="sm" className="h-8 flex-1 justify-center gap-1 text-xs">
                                <Eye className="size-3.5" />
                                <span>View</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 flex-1 justify-center gap-1 text-xs">
                                <Edit className="size-3.5" />
                                <span>Edit</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="size-8 text-red-600 hover:text-red-700">
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  : (
                      <Card className="overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/90">
                        <div className="flex items-center p-3">
                          {/* Avatar */}
                          <Avatar className="mr-3 size-10 border-2 border-white shadow-sm">
                            <AvatarImage src={customer.logo} />
                            <AvatarFallback
                              className="text-sm font-medium text-white"
                              style={{ backgroundColor: customer.brandColor }}
                            >
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>

                          {/* Content */}
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
                                <Badge className={statusColors[customer.status]}>
                                  {customer.status}
                                </Badge>
                                <div className="flex">
                                  <Button variant="ghost" size="icon" className="size-8">
                                    <Eye className="size-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="size-8">
                                    <Edit className="size-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="size-8 text-red-600 hover:text-red-700">
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
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
              <Button variant="outline" size="sm" onClick={() => setCsvUploadOpen(true)}>
                <Upload className="mr-1.5 size-3.5" />
                Import CSV
              </Button>
              <Button
                size="sm"
                onClick={() => setAddCustomerOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="mr-1.5 size-3.5" />
                New Customer
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Dialogs */}
      <CSVUploadDialog
        open={csvUploadOpen}
        onOpenChange={setCsvUploadOpen}
        onUpload={handleCSVUpload}
      />

      <AddCustomerDialog
        open={addCustomerOpen}
        onOpenChange={setAddCustomerOpen}
        onAdd={handleAddCustomer}
      />
    </div>
  );
}

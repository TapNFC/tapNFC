'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Grid3X3,
  List,
  Mail,
  MoreHorizontal,
  Phone,
  QrCode,
  Search,
  Trash2,
  Upload,
  UserPlus,
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

export default function CustomersPage() {
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
    <div className="min-h-full space-y-8 p-8">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-lg">
                <Users className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Customer Profiles
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage customer profiles with unique QR codes
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <Button variant="outline" size="lg" onClick={() => setCsvUploadOpen(true)}>
              <FileText className="mr-2 size-5" />
              CSV Template
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCsvUploadOpen(true)}>
              <Upload className="mr-2 size-5" />
              Bulk Upload
            </Button>
            <Button
              size="lg"
              onClick={() => setAddCustomerOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              <UserPlus className="mr-2 size-5" />
              Add Customer
            </Button>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          {[
            {
              title: 'Total Customers',
              value: totalCustomers.toString(),
              icon: <Users className="size-5" />,
              gradient: 'from-emerald-500 to-teal-600',
            },
            {
              title: 'Active Profiles',
              value: activeCustomers.toString(),
              icon: <Eye className="size-5" />,
              gradient: 'from-blue-500 to-cyan-600',
            },
            {
              title: 'Unique QR Codes',
              value: totalQRCodes.toString(),
              icon: <QrCode className="size-5" />,
              gradient: 'from-purple-500 to-pink-600',
            },
            {
              title: 'Draft Profiles',
              value: draftCustomers.toString(),
              icon: <FileText className="size-5" />,
              gradient: 'from-orange-500 to-red-600',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80 dark:shadow-slate-900/20"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl bg-gradient-to-br p-3 ${stat.gradient} shadow-lg`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex max-w-2xl flex-1 items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search customers, emails, or QR codes..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="h-12 border-slate-200/60 bg-white/80 pl-10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="size-10"
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="size-10"
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {filterOptions.map((filter, index) => (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              onClick={() => handleFilterChange(filter.id)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 whitespace-nowrap',
                selectedFilter === filter.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-500/50',
              )}
            >
              <span className="font-medium">{filter.label}</span>
              <Badge variant="secondary" className="ml-1">
                {filter.count}
              </Badge>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Customers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
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
              'grid gap-6',
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
            )}
          >
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="group"
              >
                <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/20 dark:border-slate-700/60 dark:bg-slate-800/80 dark:hover:shadow-slate-900/20">
                  {/* Header with Logo and Status */}
                  <div className="relative p-6 pb-4">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="size-12">
                          <AvatarImage src={customer.logo} />
                          <AvatarFallback
                            className="font-semibold text-white"
                            style={{ backgroundColor: customer.brandColor }}
                          >
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {customer.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {customer.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button size="icon" variant="secondary" className="size-8">
                          <Edit className="size-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status and QR Code ID */}
                    <div className="mb-3 flex items-center justify-between">
                      <Badge className={statusColors[customer.status]}>
                        {customer.status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
                        <QrCode className="size-4" />
                        <span className="font-mono">{customer.qrCodeId}</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      {customer.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="size-4" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      {customer.website && (
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="size-4" />
                          <span className="truncate">{customer.website}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="bg-slate-50/50 px-6 py-4 dark:bg-slate-700/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Unique QR Code
                        </p>
                        <p className="truncate text-xs text-slate-600 dark:text-slate-400">
                          {customer.qrCodeUrl}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-1 size-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="mr-1 size-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-4">
                    <div className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                      Created:
                      {' '}
                      {new Date(customer.createdAt).toLocaleDateString()}
                      {' '}
                      •
                      Updated:
                      {' '}
                      {new Date(customer.lastUpdated).toLocaleDateString()}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-2 size-4" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="mr-2 size-4" />
                        Contact
                      </Button>
                      <Button variant="outline" size="icon" className="size-8 text-red-600 hover:text-red-700">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
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
            <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
              <Users className="size-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              No customers found
            </h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              Upload a CSV file or add your first customer profile
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button variant="outline" onClick={() => setCsvUploadOpen(true)}>
                <Upload className="mr-2 size-4" />
                Bulk Upload CSV
              </Button>
              <Button
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
                onClick={() => setAddCustomerOpen(true)}
              >
                <UserPlus className="mr-2 size-4" />
                Add Customer
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

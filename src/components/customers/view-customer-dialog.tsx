'use client';

import type { LucideIcon } from 'lucide-react';
import type { Customer } from '@/types/customer';
import { Globe, Instagram, Linkedin, Mail, Palette, Phone, Twitter } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

type ViewCustomerDialogProps = {
  open: boolean;
  customer: Customer | null;
  onOpenChange: (open: boolean) => void;
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

const DetailItem = ({
  icon: Icon,
  label,
  value,
  isLink = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  isLink?: boolean;
}) => {
  if (!value) {
    return null;
  }
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
        <Icon className="size-4 text-slate-500 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        {isLink
          ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                {value}
              </a>
            )
          : (
              <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
            )}
      </div>
    </div>
  );
};

export function ViewCustomerDialog({
  open,
  customer,
  onOpenChange,
}: ViewCustomerDialogProps) {
  if (!customer) {
    return null;
  }

  const socialLinks = customer.socialLinks || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader className="items-center text-center">
          <Avatar className="mb-2 size-20 border-4 border-white shadow-md">
            <AvatarImage src={customer.logo || undefined} />
            <AvatarFallback
              className="text-2xl font-bold text-white"
              style={{ backgroundColor: customer.brandColor || undefined }}
            >
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <DialogTitle className="text-2xl font-bold">{customer.name}</DialogTitle>
          <div className="flex items-center gap-2">
            <Badge
              className={
                customer.status === 'Active'
                  ? 'border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'border-slate-500/20 bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
              }
            >
              {customer.status}
            </Badge>
            <span className="text-xs text-slate-500">
              Customer since
              {' '}
              {new Date(customer.createdAt).toLocaleDateString()}
            </span>
          </div>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Contact Details */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-400">Contact Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem icon={Mail} label="Email" value={customer.email} />
              <DetailItem icon={Phone} label="Phone" value={customer.phone} />
            </div>
          </div>
          <Separator />
          {/* Branding & Links */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-400">Branding & Links</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem icon={Globe} label="Website" value={customer.website} isLink />
              <div className="flex items-start gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                  <Palette className="size-4 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Brand Color</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-5 rounded-md border"
                      style={{ backgroundColor: customer.brandColor || undefined }}
                    />
                    <p className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                      {customer.brandColor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Social Media */}
          {(socialLinks.linkedin || socialLinks.twitter || socialLinks.instagram) && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 text-sm font-medium text-slate-400">Social Media</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailItem
                    icon={Linkedin}
                    label="LinkedIn"
                    value={socialLinks.linkedin}
                    isLink
                  />
                  <DetailItem
                    icon={Twitter}
                    label="Twitter"
                    value={socialLinks.twitter}
                    isLink
                  />
                  <DetailItem
                    icon={Instagram}
                    label="Instagram"
                    value={socialLinks.instagram}
                    isLink
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

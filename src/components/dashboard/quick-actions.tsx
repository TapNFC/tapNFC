import {
  BarChart3,
  Download,
  FileText,
  Link as LinkIcon,
  Mail,
  Phone,
  Plus,
  QrCode,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type QuickActionProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: 'default' | 'outline' | 'icon' | 'link' | 'primary' | 'secondary' | 'danger' | 'ghost';
};

function QuickActionButton({ title, description, icon, href, variant = 'outline' }: QuickActionProps) {
  return (
    <Button
      variant={variant as 'outline' | 'icon' | 'link' | 'primary' | 'secondary' | 'danger' | 'ghost' | null | undefined}
      className="flex h-auto flex-col items-start gap-2 p-4 text-left"
      asChild
    >
      <Link href={href}>
        <div className="flex w-full items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
      </Link>
    </Button>
  );
}

export function QuickActions() {
  const createActions = [
    {
      title: 'URL QR Code',
      description: 'Link to any website',
      icon: <LinkIcon className="size-4" />,
      href: '/dashboard/qr-codes/create?type=url',
    },
    {
      title: 'Text QR Code',
      description: 'Plain text message',
      icon: <FileText className="size-4" />,
      href: '/dashboard/qr-codes/create?type=text',
    },
    {
      title: 'Email QR Code',
      description: 'Email address',
      icon: <Mail className="size-4" />,
      href: '/dashboard/qr-codes/create?type=email',
    },
    {
      title: 'Phone QR Code',
      description: 'Phone number',
      icon: <Phone className="size-4" />,
      href: '/dashboard/qr-codes/create?type=phone',
    },
  ];

  const managementActions = [
    {
      title: 'View Analytics',
      description: 'Detailed reports',
      icon: <BarChart3 className="size-4" />,
      href: '/dashboard/analytics',
    },
    {
      title: 'Export Data',
      description: 'Download reports',
      icon: <Download className="size-4" />,
      href: '/dashboard/export',
    },
    {
      title: 'Settings',
      description: 'Account preferences',
      icon: <Settings className="size-4" />,
      href: '/dashboard/settings',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="size-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create QR Codes Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Create QR Code</h4>
          <div className="space-y-2">
            {createActions.map(action => (
              <QuickActionButton key={action.title} {...action} />
            ))}
          </div>
        </div>

        {/* Management Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Manage</h4>
          <div className="space-y-2">
            {managementActions.map(action => (
              <QuickActionButton key={action.title} {...action} />
            ))}
          </div>
        </div>

        {/* Primary Action */}
        <div className="border-t pt-4">
          <Button className="w-full" asChild>
            <Link href="/dashboard/qr-codes/create">
              <QrCode className="mr-2 size-4" />
              Create New QR Code
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

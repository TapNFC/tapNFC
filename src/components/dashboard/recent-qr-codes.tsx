import { ExternalLink, Eye, MoreHorizontal, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type QRCodeData = {
  id: string;
  name: string;
  url: string;
  scans: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  type: 'url' | 'text' | 'email' | 'phone';
};

const mockQRCodes: QRCodeData[] = [
  {
    id: '1',
    name: 'Company Website',
    url: 'https://company.com',
    scans: 234,
    status: 'active',
    createdAt: '2024-01-15',
    type: 'url',
  },
  {
    id: '2',
    name: 'Contact Info',
    url: 'mailto:contact@company.com',
    scans: 89,
    status: 'active',
    createdAt: '2024-01-14',
    type: 'email',
  },
  {
    id: '3',
    name: 'Product Demo',
    url: 'https://demo.company.com',
    scans: 156,
    status: 'active',
    createdAt: '2024-01-13',
    type: 'url',
  },
  {
    id: '4',
    name: 'Support Phone',
    url: 'tel:+1234567890',
    scans: 45,
    status: 'inactive',
    createdAt: '2024-01-12',
    type: 'phone',
  },
  {
    id: '5',
    name: 'Event Registration',
    url: 'https://events.company.com/register',
    scans: 312,
    status: 'active',
    createdAt: '2024-01-11',
    type: 'url',
  },
];

function QRCodeRow({ qrCode }: { qrCode: QRCodeData }) {
  const statusColor = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }[qrCode.status];

  const typeIcon = {
    url: <ExternalLink className="size-3" />,
    email: <ExternalLink className="size-3" />,
    phone: <ExternalLink className="size-3" />,
    text: <ExternalLink className="size-3" />,
  }[qrCode.type];

  return (
    <div className="flex items-center justify-between border-b p-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <QrCode className="size-5" />
        </div>
        <div>
          <div className="font-medium">{qrCode.name}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {typeIcon}
            {qrCode.url.length > 40 ? `${qrCode.url.substring(0, 40)}...` : qrCode.url}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm">
            <Eye className="size-3" />
            {qrCode.scans}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(qrCode.createdAt).toLocaleDateString()}
          </div>
        </div>

        <Badge variant="secondary" className={statusColor}>
          {qrCode.status}
        </Badge>

        <Button variant="ghost" size="sm">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function RecentQRCodes() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent QR Codes</CardTitle>
            <CardDescription>
              Your most recently created QR codes and their performance
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/qr-codes">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {mockQRCodes.map(qrCode => (
            <QRCodeRow key={qrCode.id} qrCode={qrCode} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

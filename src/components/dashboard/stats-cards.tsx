import { Eye, MousePointer, QrCode, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StatCardProps = {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
};

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-muted-foreground',
  }[changeType];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="size-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${changeColor} flex items-center gap-1`}>
          {changeType === 'positive' && <TrendingUp className="size-3" />}
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: 'Total QR Codes',
      value: 24,
      change: '+2 from last month',
      changeType: 'positive' as const,
      icon: <QrCode className="size-4" />,
    },
    {
      title: 'Total Scans',
      value: '1,234',
      change: '+12% from last week',
      changeType: 'positive' as const,
      icon: <Eye className="size-4" />,
    },
    {
      title: 'Click-through Rate',
      value: '68%',
      change: '+5% from last week',
      changeType: 'positive' as const,
      icon: <MousePointer className="size-4" />,
    },
    {
      title: 'Active QR Codes',
      value: 18,
      change: 'No change',
      changeType: 'neutral' as const,
      icon: <QrCode className="size-4" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

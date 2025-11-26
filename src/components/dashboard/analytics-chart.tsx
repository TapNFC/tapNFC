'use client';

import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ChartData = {
  date: string;
  scans: number;
  clicks: number;
};

const mockData: ChartData[] = [
  { date: '2024-01-01', scans: 120, clicks: 89 },
  { date: '2024-01-02', scans: 150, clicks: 112 },
  { date: '2024-01-03', scans: 180, clicks: 134 },
  { date: '2024-01-04', scans: 165, clicks: 98 },
  { date: '2024-01-05', scans: 200, clicks: 156 },
  { date: '2024-01-06', scans: 175, clicks: 142 },
  { date: '2024-01-07', scans: 220, clicks: 178 },
];

export function AnalyticsChart() {
  const totalScans = mockData.reduce((sum, item) => sum + item.scans, 0);
  const totalClicks = mockData.reduce((sum, item) => sum + item.clicks, 0);
  const maxValue = Math.max(...mockData.map(item => Math.max(item.scans, item.clicks)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-5" />
          Analytics Overview
        </CardTitle>
        <CardDescription>
          QR code scans and clicks over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalScans}</div>
              <div className="text-sm text-muted-foreground">Total Scans</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{totalClicks}</div>
              <div className="text-sm text-muted-foreground">Total Clicks</div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {mockData.map((item, index) => (
              <div key={item.date} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Day
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">
                    {item.scans}
                    {' '}
                    scans,
                    {item.clicks}
                    {' '}
                    clicks
                  </span>
                </div>
                <div className="space-y-1">
                  {/* Scans Bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-xs text-blue-600">Scans</div>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${(item.scans / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                  {/* Clicks Bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-xs text-green-600">Clicks</div>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-green-600 transition-all duration-300"
                        style={{ width: `${(item.clicks / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Growth Indicator */}
          <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950">
            <TrendingUp className="size-4" />
            <span>+12% increase from last week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

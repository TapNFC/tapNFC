'use client';

import { cn } from '@/lib/utils';

export const QRPattern = ({ seed, className }: { seed: number; className?: string }) => {
  const size = 25;
  const pattern = [];

  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const isFinderPattern
        = (i < 9 && j < 9)
          || (i < 9 && j >= size - 9)
          || (i >= size - 9 && j < 9);

      if (isFinderPattern) {
        const relI = i < 9 ? i : i - (size - 9);
        const relJ = j < 9 ? j : j >= size - 9 ? j - (size - 9) : j;

        if ((relI === 0 || relI === 8 || relJ === 0 || relJ === 8)
          || (relI >= 2 && relI <= 6 && relJ >= 2 && relJ <= 6)) {
          row.push(true);
        } else {
          row.push(false);
        }
      } else if (i === 8 || j === 8) {
        row.push((i + j) % 2 === 0);
      } else {
        const hash = ((i * size + j) * seed) % 7;
        row.push(hash < 3);
      }
    }
    pattern.push(row);
  }

  return (
    <div className={cn('size-full', className)}>
      {pattern.map((row, i) => (
        <div key={i} className="flex" style={{ height: `${100 / 25}%` }}>
          {row.map((cell, j) => (
            <div
              key={j}
              className={cn(
                'flex-1',
                cell ? 'bg-black' : 'bg-white',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

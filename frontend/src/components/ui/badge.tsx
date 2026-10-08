import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, color, style, ...props }: React.HTMLAttributes<HTMLSpanElement> & { color?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', !color && 'bg-royal-50 text-royal-700', className)}
      style={color ? { backgroundColor: `${color}14`, color, ...style } : style}
      {...props}
    />
  );
}

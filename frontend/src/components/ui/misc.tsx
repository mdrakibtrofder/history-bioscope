import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-royal-50', className)} />;
}

export function Spinner({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-16 text-sm text-muted', className)}>
      <Loader2 className="size-5 animate-spin text-royal-500" /> {label}
    </div>
  );
}

export function EmptyState({ icon, title, children }: { icon?: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-royal-200 bg-royal-50/40 px-6 py-14 text-center">
      {icon && <div className="mb-3 text-royal-400 [&_svg]:size-10">{icon}</div>}
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {children && <div className="mt-1 max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, children, className }: { eyebrow?: string; title: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('max-w-3xl', className)}>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-royal-500">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold text-ink md:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-base text-muted">{children}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow?: string; title: React.ReactNode; children?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-line soft-gradient">
      <div className="absolute inset-0 grid-pattern opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
        <div className="max-w-3xl">
          {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-royal-500">{eyebrow}</p>}
          <h1 className="text-3xl font-semibold text-ink md:text-5xl">{title}</h1>
          {children && <div className="mt-3 text-base text-muted">{children}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

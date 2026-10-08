'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Clock, Globe2, LayoutDashboard, Menu, Network, Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

const NAV = [
  { href: '/timeline/bangladesh', label: 'Timelines', icon: Clock, match: '/timeline' },
  { href: '/map', label: 'Map Explorer', icon: Globe2, match: '/map' },
  { href: '/graph', label: 'Knowledge Graph', icon: Network, match: '/graph' },
  { href: '/stories', label: 'Stories', icon: BookOpen, match: '/stories' },
  { href: '/admin', label: 'Admin', icon: LayoutDashboard, match: '/admin' },
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const setSearchOpen = useApp((s) => s.setSearchOpen);
  const mode = useApp((s) => s.dataMode);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSearchOpen]);

  return (
    <header className="sticky top-0 z-[500] border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-ink">History Bioscope</p>
            <p className="hidden font-bangla text-[11px] text-muted sm:block">ইতিহাস বায়োস্কোপ</p>
          </div>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = path.startsWith(n.match);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
                  active ? 'text-royal-700' : 'text-muted hover:text-royal-700',
                )}
              >
                <n.icon className="size-4" />
                {n.label}
                {active && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-xl bg-royal-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-line bg-white/80 px-3 text-sm text-muted shadow-sm transition hover:border-royal-300 hover:text-royal-700 md:w-64"
            aria-label="Search"
          >
            <Search className="size-4" />
            <span className="hidden md:inline">Search history…</span>
            <kbd className="ml-auto hidden rounded-md border border-line bg-royal-50 px-1.5 py-0.5 text-[10px] font-semibold md:inline">Ctrl K</kbd>
          </button>
          <span
            title={mode === 'api' ? 'Connected to NestJS API' : mode === 'local' ? 'Browser storage mode (API offline)' : 'Detecting…'}
            className={cn('hidden size-2.5 rounded-full sm:block', mode === 'api' ? 'bg-emerald-500' : mode === 'local' ? 'bg-amber-400' : 'bg-slate-300')}
          />
          <button className="cursor-pointer rounded-xl p-2 text-ink lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <div className="grid gap-1 p-3">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-ink hover:bg-royal-50">
                  <n.icon className="size-5 text-royal-600" /> {n.label}
                </Link>
              ))}
              <Link href="/search" className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-ink hover:bg-royal-50">
                <Search className="size-5 text-royal-600" /> Advanced Search
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

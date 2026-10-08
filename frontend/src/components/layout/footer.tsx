import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-gradient-to-b from-white to-royal-50/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Logo />
            <p className="font-display text-lg font-semibold">History Bioscope</p>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted">
            An interactive museum of time and place — explore Bangladesh, Islamic and World history through timelines, maps, stories and connections.
          </p>
          <p className="mt-4 max-w-md text-xs text-muted/80">
            Dates for early periods and prophets are traditional or approximate. Images and summaries are loaded live from Wikipedia / Wikimedia Commons under their respective licences.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-royal-500">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-royal-700" href="/timeline/bangladesh">Bangladesh Timeline</Link></li>
            <li><Link className="hover:text-royal-700" href="/timeline/islamic">Islamic Timeline</Link></li>
            <li><Link className="hover:text-royal-700" href="/timeline/world">World Timeline</Link></li>
            <li><Link className="hover:text-royal-700" href="/timeline/all?mode=journey">Historical Journey</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-royal-500">Tools</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-royal-700" href="/map">Map Explorer</Link></li>
            <li><Link className="hover:text-royal-700" href="/graph">Knowledge Graph</Link></li>
            <li><Link className="hover:text-royal-700" href="/search">Advanced Search</Link></li>
            <li><Link className="hover:text-royal-700" href="/admin">Admin Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">© {new Date().getFullYear()} History Bioscope · Built for students, researchers and educators</div>
    </footer>
  );
}

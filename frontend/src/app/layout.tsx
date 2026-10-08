import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { GlobalSearch } from '@/components/layout/global-search';
import { ModeBanner } from '@/components/layout/mode-banner';
import { Navbar } from '@/components/layout/navbar';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: 'History Bioscope – Interactive Historical Timeline & Map Explorer', template: '%s · History Bioscope' },
  description:
    'Explore Bangladesh, Islamic and World history through interactive timelines, historical maps, satellite views, stories and a knowledge graph.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <ModeBanner />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <GlobalSearch />
        </Providers>
      </body>
    </html>
  );
}

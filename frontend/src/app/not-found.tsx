import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-7xl font-semibold text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-semibold">This page is lost in time</h1>
      <p className="mt-2 text-muted">The page you are looking for does not exist — yet.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-royal-600 px-5 py-2.5 font-semibold text-white">Return home</Link>
    </div>
  );
}

// Copies ../data/seed/*.json into public/seed so the site also works offline
// (browser LocalStorage mode) when the NestJS API is not running.
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const src = resolve(process.cwd(), '../data/seed');
const dst = resolve(process.cwd(), 'public/seed');
if (existsSync(src)) {
  mkdirSync(dst, { recursive: true });
  cpSync(src, dst, { recursive: true });
  console.log('✓ Seed data synced to public/seed');
} else {
  console.warn('! ../data/seed not found – using existing public/seed');
}

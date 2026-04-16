// lib/getBaseUrl.ts
import 'server-only';
import { headers } from 'next/headers';

export async function getBaseUrl() {
  // 1) Try request-scoped headers (SSR)
  try {
    const h = await headers(); // <- await fixes TS2339
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'https';
    if (host) return `${proto}://${host}`;
  } catch {
    // headers() may be unavailable during ISR/background renders
  }

  // 2) Env fallbacks (ISR/SSG/background)
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // 3) Local dev
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000';

  // 4) Final prod fallback (set your real domain in env ideally)
  return 'https://www.stuffbyaymen.com';
}

import type { NextConfig } from 'next'

const replitDomain = process.env.REPLIT_DOMAINS ?? process.env.REPLIT_DEV_DOMAIN ?? ''

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: replitDomain
    ? [replitDomain, `*.${replitDomain.split('.').slice(1).join('.')}`, '*.replit.dev', '*.kirk.replit.dev']
    : ['*.replit.dev', '*.kirk.replit.dev'],
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
}

export default nextConfig

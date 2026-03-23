import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/login',
  '/forgot-password',
  '/change-password',
  '/verifikasi-akun',
  '/link-expired',
]

const AUTH_ONLY_PATHS = ['/login', '/forgot-password', '/change-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('@rextra/access_token')?.value

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )
  const isAuthOnly = AUTH_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  // If logged in and trying to access auth-only pages, redirect to dashboard
  if (token && isAuthOnly) {
    return NextResponse.redirect(new URL('/persona-rextra', request.url))
  }

  // If not logged in and trying to access protected pages, redirect to login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|icons|api).*)',
  ],
}

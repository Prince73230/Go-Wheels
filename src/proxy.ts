import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ==========================================
  // PROTECT ADMIN PAGES
  // ==========================================

  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  ) {
    const session = getSessionFromRequest(request)

    // Not logged in
    if (!session) {
      const loginUrl = new URL(
        '/navigation/login',
        request.url
      )

      return NextResponse.redirect(loginUrl)
    }

    // Logged in but NOT admin
    if (!session.isAdmin) {
      const homeUrl = new URL(
        '/',
        request.url
      )

      return NextResponse.redirect(homeUrl)
    }

    // Admin is allowed
    return NextResponse.next()
  }

  // ==========================================
  // PROTECT ADMIN APIs
  // ==========================================

  if (
    pathname === '/api/admin' ||
    pathname.startsWith('/api/admin/')
  ) {
    const session = getSessionFromRequest(request)

    // Not logged in
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        {
          status: 401,
        }
      )
    }

    // Logged in but NOT admin
    if (!session.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin access required',
        },
        {
          status: 403,
        }
      )
    }

    // Admin is allowed
    return NextResponse.next()
  }

  return NextResponse.next()
}

// ==========================================
// MATCHER
// ==========================================

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
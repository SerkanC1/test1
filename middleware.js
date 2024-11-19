// middleware.js
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Pre-auth middleware
export function middleware(request) {
  // Root path'i login'e yönlendir
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

// Auth middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/auth/session'
  ]
}
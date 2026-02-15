import { NextResponse, NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const session = request.cookies.get('admin_session')

    // 1. Protect /admin routes
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // 2. Prevent logged-in users from seeing /admin/login
    if (pathname.startsWith('/admin/login')) {
        if (session) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/admin/:path*',
}

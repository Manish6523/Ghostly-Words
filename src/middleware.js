import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from 'next-auth/middleware'

// This function can be marked `async` if using `await` inside
export async function middleware(request) {

    const token = await getToken({ req: request })
    const url = request.nextUrl

    if (token &&
        !url.pathname.startsWith('/dashboard') && // Avoid loop
        (
            url.pathname === '/' ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/verify')
        )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // return NextResponse.redirect(new URL('/', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}
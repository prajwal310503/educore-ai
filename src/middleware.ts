import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const isLoggedIn = !!session
  const role = session?.user?.role as string | undefined

  const authPages = ['/login', '/register']
  const isAuthPage = authPages.some(p => pathname.startsWith(p))
  const isAdminRoute = pathname.startsWith('/admin')
  const isInstructorRoute = pathname.startsWith('/instructor')
  const isProtectedRoute = ['/dashboard', '/courses', '/instructor', '/admin']
    .some(p => pathname.startsWith(p))

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminRoute && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (isInstructorRoute && !['ADMIN', 'INSTRUCTOR'].includes(role ?? '')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}

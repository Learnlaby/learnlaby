import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // If the pathname starts with /protected and the user is not an admin, redirect to the home page
  if (pathname.startsWith('/protected') && (!user || (user as { role?: string }).role !== 'admin')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Continue with the request if the user is an admin or the route is not protected
  return NextResponse.next()
}

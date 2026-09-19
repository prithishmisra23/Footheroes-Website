import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Set Security Headers defined in AGENT.md
  supabaseResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  supabaseResponse.headers.set('X-Frame-Options', 'DENY');
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block');
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  supabaseResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.supabase.co https://res.cloudinary.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; media-src 'self' https://res.cloudinary.com; frame-src 'none';");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mockproject.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

  // Create a Supabase client configured to use cookies if env vars exist
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          
          // Re-apply headers after creating a new response
          supabaseResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
          supabaseResponse.headers.set('X-Frame-Options', 'DENY');
          supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
          supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block');
          supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
          supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
          supabaseResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.supabase.co https://res.cloudinary.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; media-src 'self' https://res.cloudinary.com; frame-src 'none';");
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (e) {
      console.warn("Supabase auth error in middleware", e);
    }
  } else {
    // Mock user for development before Supabase is connected
    const hasMockToken = request.cookies.has('mock_auth_token');
    if (hasMockToken) {
      user = { id: 'mock-user' };
    }
  }

  // Protected paths logic
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.includes('/edit') || 
    pathname.includes('/manage') ||
    pathname.includes('/score') ||
    pathname.startsWith('/discover/scout');

  if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

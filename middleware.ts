import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Liste des routes qui nécessitent une authentification
const protectedRoutes = ['/dashboard', '/clients', '/users', '/connected', '/verification'];

// Liste des routes accessibles uniquement aux utilisateurs non authentifiés
const authRoutes = ['/login', '/register', '/create-account', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si l'utilisateur est authentifié
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development',
  });

  const isAuthenticated = !!token;

  // Rediriger les utilisateurs non authentifiés vers la page de connexion
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Rediriger les utilisateurs authentifiés vers le tableau de bord s'ils tentent d'accéder aux pages d'authentification
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/clients', request.url));
  }

  // Rediriger vers la page des clients après la connexion
  if (pathname === '/connected' && isAuthenticated) {
    return NextResponse.redirect(new URL('/clients', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

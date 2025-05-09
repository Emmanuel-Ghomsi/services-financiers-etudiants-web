import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Liste des routes qui nécessitent une authentification
const protectedRoutes = ['/dashboard', '/clients', '/users', '/connected', '/verification'];

// Liste des routes accessibles uniquement aux utilisateurs non authentifiés
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/create-account',
  '/auth/forgot-password',
];

// Liste des routes qui nécessitent des rôles spécifiques
const adminRoutes = ['/users'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si l'utilisateur est authentifié
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Vérifier si le token a une erreur
  if (token?.error) {
    // Si l'erreur est liée à un token expiré, rediriger directement vers la page de connexion
    if (token.error === 'RefreshTokenExpired' || token.error === 'RefreshAccessTokenError') {
      // Rediriger directement vers la page de connexion avec un message d'erreur
      return NextResponse.redirect(new URL(`/auth/login?error=${token.error}`, request.url));
    }
  }

  const isAuthenticated = !!token && !token.error;
  const userRoles = token?.user?.roles || [];
  const isAdmin = userRoles.some(
    (role) =>
      typeof role === 'string' &&
      (role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'SUPER_ADMIN')
  );

  // Rediriger les utilisateurs authentifiés qui accèdent à la racine vers le dashboard
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Rediriger les utilisateurs non authentifiés vers la page de connexion
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Vérifier les permissions pour les routes admin
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute && isAuthenticated) {
    if (!userRoles || userRoles.length === 0) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Rediriger les utilisateurs authentifiés vers le tableau de bord s'ils tentent d'accéder aux pages d'authentification
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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

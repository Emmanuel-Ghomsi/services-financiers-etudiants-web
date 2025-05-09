import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Récupérer les paramètres d'erreur de l'URL
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');

  // Construire l'URL de redirection avec les mêmes paramètres
  const redirectUrl = new URL('/auth/error', request.url);

  // Copier tous les paramètres de recherche
  searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value);
  });

  // Rediriger vers la page d'erreur correcte
  return NextResponse.redirect(redirectUrl);
}

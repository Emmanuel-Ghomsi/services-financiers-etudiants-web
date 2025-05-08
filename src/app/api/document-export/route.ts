import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { EXPORT_API_URL } from '@/config';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification pour l'accès à la route (sécurité de l'application)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer le corps de la requête (FormData)
    const formData = await request.formData();

    // Faire la requête vers l'API externe en HTTP sans authentification
    const response = await fetch(EXPORT_API_URL, {
      method: 'POST',
      // Pas d'en-tête Authorization car l'API n'est pas protégée
      body: formData,
    });

    // Si la réponse n'est pas OK, retourner l'erreur
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erreur inconnue');
      console.error(`Erreur API export: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Erreur lors de l'export: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Récupérer le type de contenu et le blob
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const blob = await response.blob();

    // Créer une nouvelle réponse avec le blob
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': response.headers.get('content-disposition') || 'attachment',
      },
    });
  } catch (error) {
    console.error("Erreur lors du proxy d'export:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

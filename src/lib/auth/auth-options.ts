import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';

// Types pour les tokens et utilisateurs
interface TokenData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: Date;
  refreshTokenExpires: Date;
  user: {
    id: string;
    email: string;
    username: string;
    roles: string[];
  };
}

// Function to decode JWT token
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Fonction pour rafraîchir le token d'accès
async function refreshAccessToken(
  token: JWT & Partial<TokenData>
): Promise<JWT & Partial<TokenData>> {
  try {
    // Vérifier si le refresh token est expiré
    if (token.refreshTokenExpires && new Date(token.refreshTokenExpires) < new Date()) {
      console.warn('Refresh token expiré, déconnexion requise');
      return {
        ...token,
        error: 'RefreshTokenExpired',
      };
    }

    // Appel à l'API pour rafraîchir le token
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: token.refreshToken,
      }),
    });

    if (!response.ok) {
      // Analyser l'erreur pour fournir un message plus précis
      let errorMessage = 'Échec du rafraîchissement du token';
      let errorType = 'RefreshAccessTokenError';

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;

        // Détecter spécifiquement le message "Refresh token expiré"
        if (errorMessage.includes('Refresh token expiré')) {
          errorType = 'RefreshTokenExpired';
        }
      } catch (e) {
        // Ignorer les erreurs de parsing JSON
      }

      console.error(`Erreur HTTP ${response.status}: ${errorMessage}`);

      return {
        ...token,
        error: errorType,
        errorDetail: errorMessage,
      };
    }

    const refreshedTokens = await response.json();

    // Décoder le nouveau token pour extraire les informations utilisateur
    const decodedToken = decodeJWT(refreshedTokens.access_token);

    if (!decodedToken) {
      throw new Error('Token rafraîchi invalide');
    }

    console.log('Token rafraîchi avec succès');

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: new Date(refreshedTokens.expire_date),
      refreshToken: refreshedTokens.refresh_token,
      refreshTokenExpires: new Date(refreshedTokens.refresh_expire_date),
      user: {
        id: decodedToken.id,
        email: decodedToken.email,
        username: decodedToken.username,
        roles: decodedToken.roles,
      },
      error: undefined, // Effacer toute erreur précédente
    };
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);

    // Déterminer le type d'erreur pour une meilleure gestion
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    let errorType = 'RefreshAccessTokenError';

    // Détecter spécifiquement le message "Refresh token expiré"
    if (errorMessage.includes('Refresh token expiré')) {
      errorType = 'RefreshTokenExpired';
    }

    return {
      ...token,
      error: errorType,
      errorDetail: errorMessage,
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Nom d'utilisateur ou Email", type: 'text' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Appel à l'API pour authentifier l'utilisateur
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            // Analyser l'erreur pour fournir un message plus précis
            let errorMessage = "Échec de l'authentification";
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Ignorer les erreurs de parsing JSON
            }

            console.error(`Erreur HTTP ${response.status}: ${errorMessage}`);
            throw new Error(errorMessage);
          }

          const data = await response.json();

          // Décoder le token pour extraire les informations utilisateur
          const decodedToken = decodeJWT(data.access_token);

          if (!decodedToken) {
            throw new Error('Token invalide');
          }

          // Retourner les données de l'utilisateur et les tokens
          return {
            id: decodedToken.id,
            email: decodedToken.email,
            username: decodedToken.username,
            roles: decodedToken.roles,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpires: new Date(data.expire_date),
            refreshTokenExpires: new Date(data.refresh_expire_date),
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 jours (correspondant à la durée de vie du refresh token)
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Première connexion
      if (user && account) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          refreshTokenExpires: user.refreshTokenExpires,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles,
          },
        };
      }

      // Vérifier si le token d'accès est toujours valide
      if (token.accessTokenExpires && new Date(token.accessTokenExpires) > new Date()) {
        return token;
      }

      // Le token a expiré, essayer de le rafraîchir
      console.log('Token expiré, tentative de rafraîchissement...');
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Ajouter les informations du token à la session
      if (token.user) {
        session.user = token.user as any;
      }

      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;

      // Ajouter des informations supplémentaires à la session si nécessaire
      session.expires = token.accessTokenExpires as unknown as string;

      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

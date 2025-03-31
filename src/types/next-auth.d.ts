import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    username: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: Date;
    refreshTokenExpires: Date;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      username: string;
      roles: string[];
    } & DefaultSession['user'];
    accessToken: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: Date;
    refreshTokenExpires?: Date;
    user?: {
      id: string;
      email: string;
      username: string;
      roles: string[];
    };
    error?: string;
  }
}

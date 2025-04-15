import type React from 'react';
import type { Metadata } from 'next';
import { Open_Sans, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';

// Définir Open Sans comme police principale
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

// Garder Inter comme police de secours
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Services Financiers Étudiants',
  description: 'Application de gestion des clients pour Services Financiers Étudiants',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${openSans.variable} ${inter.variable}`}>
      <body className={openSans.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Providers>{children}</Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

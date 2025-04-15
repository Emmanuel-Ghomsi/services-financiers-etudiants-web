'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { AppHeader } from './app-header';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useProfile } from '@/lib/api/hooks/use-profile';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  title?: string;
  userName?: string; // Cette prop est utilisée comme fallback
}

export function AuthenticatedLayout({
  children,
  title,
  userName: propUserName,
}: AuthenticatedLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { profile } = useProfile();

  // Utiliser le nom fourni en prop ou celui du profil
  const userName = propUserName || profile?.firstname || profile?.username || '';
  const userImage = profile?.profilePicture;

  // Vérifier l'état de la session
  useAuthCheck();

  // Fermer la sidebar sur mobile lors d'un changement de route
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile]);

  // Ajouter une classe au body pour empêcher le défilement quand la sidebar est ouverte sur mobile
  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobile, mobileOpen]);

  // Fonction pour gérer le clic sur le bouton de menu
  const handleMenuClick = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Overlay pour mobile quand la sidebar est ouverte */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={cn(
          'flex flex-col flex-1 transition-all duration-300 ease-in-out',
          // Desktop
          !isMobile && (sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'),
          // Mobile - pas de marge, pleine largeur
          isMobile && 'ml-0'
        )}
      >
        <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
          <div className="flex items-center h-16 px-4">
            <Button variant="ghost" size="icon" onClick={handleMenuClick} className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">{isMobile ? 'Ouvrir le menu' : 'Toggle menu'}</span>
            </Button>
            <AppHeader title={title} userName={userName} userImage={userImage} />
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

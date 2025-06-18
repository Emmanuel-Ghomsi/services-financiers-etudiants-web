'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users, UserPlus, ChevronDown, ChevronRight, LogOut, Home, X, Receipt } from 'lucide-react';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { signOut } from 'next-auth/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  // Vérifier si l'utilisateur a un rôle d'administrateur
  const isAdmin = profile?.roles?.some(
    (role) => role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'SUPER_ADMIN'
  );

  // Vérifier si l'utilisateur peut accéder aux dépenses (ADMIN, SUPER_ADMIN, RH)
  const canAccessExpenses = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN', 'RH'].includes(role.toUpperCase())
  );

  // Fonction pour basculer l'état d'un menu
  const toggleMenu = (menuId: string) => {
    if (collapsed) {
      setCollapsed(false);
      // Attendre que le sidebar s'ouvre avant d'ouvrir le menu
      setTimeout(() => {
        setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
      }, 300);
    } else {
      setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
    }
  };

  // Fermer tous les menus lorsque le sidebar est réduit
  useEffect(() => {
    if (collapsed) {
      setOpenMenus({});
    }
  }, [collapsed]);

  // Fonction explicite pour fermer la sidebar sur mobile
  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      // Déconnecter l'utilisateur via NextAuth
      await signOut({ redirect: false });

      // Afficher un message de confirmation
      toast.success('Vous avez été déconnecté avec succès');

      // Rediriger vers la page de connexion
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Une erreur est survenue lors de la déconnexion');
    }
  };

  // Déterminer si un lien est actif
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    if (path !== '/dashboard' && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div
      data-sidebar="true"
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-brand-blue text-white transition-all duration-300 ease-in-out',
        // Desktop
        !isMobile && (collapsed ? 'w-16' : 'w-64'),
        // Mobile
        isMobile && (mobileOpen ? 'translate-x-0' : '-translate-x-full'),
        isMobile && 'w-64 shadow-lg'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-brand-blue-light px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* Logo */}
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-brand-blue font-bold">
            SFE
          </div>
          {(!collapsed || isMobile) && (
            <span className="text-lg font-semibold">Services Financiers Etudiants</span>
          )}
        </Link>

        {/* Bouton de fermeture sur mobile */}
        {isMobile && (
          <button
            type="button"
            className="p-2 rounded-md text-white hover:bg-brand-blue-light focus:outline-none"
            onClick={closeMobileSidebar}
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <nav className="flex flex-col gap-1">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              isActive('/dashboard')
                ? 'bg-white text-brand-blue font-medium'
                : 'text-white hover:bg-brand-blue-light'
            )}
            onClick={isMobile ? closeMobileSidebar : undefined}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>Tableau de bord</span>}
          </Link>

          {/* Utilisateurs - visible uniquement pour les admins */}
          {isAdmin && (
            <div>
              <button
                onClick={() => toggleMenu('users')}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive('/users')
                    ? 'bg-white text-brand-blue font-medium'
                    : 'text-white hover:bg-brand-blue-light'
                )}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 flex-shrink-0" />
                  {(!collapsed || isMobile) && <span>Utilisateurs</span>}
                </div>
                {(!collapsed || isMobile) && (
                  <div>
                    {openMenus.users ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                )}
              </button>

              {openMenus.users && (!collapsed || isMobile) && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  <Link
                    href="/users"
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive('/users') && pathname === '/users'
                        ? 'bg-brand-blue-light text-white font-medium'
                        : 'text-white/90 hover:bg-brand-blue-light'
                    )}
                    onClick={isMobile ? closeMobileSidebar : undefined}
                  >
                    <span>Liste des utilisateurs</span>
                  </Link>
                  <Link
                    href="/users/add"
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive('/users/add')
                        ? 'bg-brand-blue-light text-white font-medium'
                        : 'text-white/90 hover:bg-brand-blue-light'
                    )}
                    onClick={isMobile ? closeMobileSidebar : undefined}
                  >
                    <span>Ajouter un utilisateur</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Clients */}
          <div>
            <button
              onClick={() => toggleMenu('clients')}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive('/clients')
                  ? 'bg-white text-brand-blue font-medium'
                  : 'text-white hover:bg-brand-blue-light'
              )}
            >
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 flex-shrink-0" />
                {(!collapsed || isMobile) && <span>Clients</span>}
              </div>
              {(!collapsed || isMobile) && (
                <div>
                  {openMenus.clients ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </button>

            {openMenus.clients && (!collapsed || isMobile) && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Link
                  href="/clients"
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive('/clients') && pathname === '/clients'
                      ? 'bg-brand-blue-light text-white font-medium'
                      : 'text-white/90 hover:bg-brand-blue-light'
                  )}
                  onClick={isMobile ? closeMobileSidebar : undefined}
                >
                  <span>Liste des clients</span>
                </Link>
                <Link
                  href="/clients/new"
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive('/clients/new')
                      ? 'bg-brand-blue-light text-white font-medium'
                      : 'text-white/90 hover:bg-brand-blue-light'
                  )}
                  onClick={isMobile ? closeMobileSidebar : undefined}
                >
                  <span>Ajouter un client</span>
                </Link>
              </div>
            )}
          </div>

          {/* Dépenses - visible pour ADMIN, SUPER_ADMIN, RH */}
          {canAccessExpenses && (
            <Link
              href="/expenses"
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive('/expenses')
                  ? 'bg-white text-brand-blue font-medium'
                  : 'text-white hover:bg-brand-blue-light'
              )}
              onClick={isMobile ? closeMobileSidebar : undefined}
            >
              <Receipt className="h-5 w-5 flex-shrink-0" />
              {(!collapsed || isMobile) && <span>Dépenses</span>}
            </Link>
          )}
        </nav>
      </div>

      <div className="border-t border-brand-blue-light p-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white transition-colors hover:bg-brand-blue-light"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from './logo';
import { useMediaQuery } from '@/hooks/use-media-query';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Fermer automatiquement la sidebar sur mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile, setCollapsed]);

  // Fermer la sidebar lors d'un changement de route sur mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [pathname, isMobile, setCollapsed]);

  const navItems = [
    {
      title: 'Tableau de bord',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Clients',
      href: '/clients',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Utilisateurs',
      href: '/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Paramètres',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Overlay pour fermer la sidebar sur mobile */}
      {isMobile && !collapsed && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setCollapsed(true)} />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-white border-r transition-all duration-300 ease-in-out',
          collapsed ? 'w-0 md:w-16 -translate-x-full md:translate-x-0' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <div className="flex-1">
                <Logo minimal={true} />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className={cn('md:flex', collapsed ? 'hidden' : '')}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Réduire le menu</span>
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-brand-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100',
                      collapsed ? 'justify-center md:px-3' : ''
                    )}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t mt-auto">
            <Button
              variant="ghost"
              className={cn(
                'w-full flex items-center gap-3 text-red-600 hover:bg-red-50 hover:text-red-700',
                collapsed ? 'justify-center' : ''
              )}
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Déconnexion</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

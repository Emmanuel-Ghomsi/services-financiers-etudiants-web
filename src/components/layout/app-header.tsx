'use client';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileImage } from '@/components/common/profile-image';
import { NotificationsDropdown } from '@/components/notifications/notifications-dropdown';

interface AppHeaderProps {
  title?: string;
  userName?: string;
  userImage?: string | null;
}

export function AppHeader({ title, userName, userImage }: AppHeaderProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Vous avez été déconnecté avec succès');
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Une erreur est survenue lors de la déconnexion');
    }
  };

  return (
    <div className="flex flex-1 items-center justify-between">
      <h1 className="text-xl font-semibold">{title || 'Tableau de bord'}</h1>

      <div className="flex items-center gap-2">
        {/* Composant de notification */}
        <NotificationsDropdown />

        {/* Version desktop: boutons séparés */}
        {!isMobile && (
          <>
            <Button variant="ghost" onClick={() => router.push('/profile')}>
              <User className="h-5 w-5 mr-2" />
              <span>Profil</span>
            </Button>

            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" />
              <span>Déconnexion</span>
            </Button>
          </>
        )}

        {/* Version mobile: dropdown menu */}
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <ProfileImage
                  src={userImage}
                  alt={userName || 'Utilisateur'}
                  fallback={(userName?.charAt(0) || 'U').toUpperCase()}
                  size="sm"
                />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

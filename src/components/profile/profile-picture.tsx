'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUpdateProfilePicture } from '@/lib/api/hooks/use-profile-mutations';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/api/hooks/use-profile';
import { useProfileStore } from '@/lib/stores/profile-store';
// Remplacer l'Avatar existant par notre nouveau composant ProfileImage
// Importer le composant
import { ProfileImage } from '@/components/common/profile-image';

interface ProfilePictureProps {
  profile: UserProfile;
}

// Modifier la partie qui utilise ProfileImage pour éviter les re-rendus infinis
export function ProfilePicture({ profile }: ProfilePictureProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateProfilePicture, isPending } = useUpdateProfilePicture();
  const { toast } = useToast();
  const storeProfile = useProfileStore((state) => state.profile);

  // Utiliser la photo de profil du store si disponible
  const profilePicture = storeProfile?.profilePicture || profile.profilePicture;

  // Ne pas générer de clé dynamique à chaque rendu
  // Cela peut causer des re-rendus infinis
  // const avatarKey = profilePicture ? `avatar-${profilePicture.split("/").pop()}` : "avatar-default"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille du fichier (5Mo max)
    if (file.size > 5 * 1024 * 1024) {
      toast('La taille du fichier ne doit pas dépasser 5Mo');
      e.target.value = '';
      return;
    }

    // Vérifier le type de fichier (images uniquement)
    if (!file.type.startsWith('image/')) {
      toast('Veuillez sélectionner une image');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = () => {
    if (selectedFile) {
      updateProfilePicture(selectedFile, {
        onSuccess: () => {
          setPreviewUrl(null);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
      });
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    if (profile.firstname && profile.lastname) {
      return `${profile.firstname.charAt(0)}${profile.lastname.charAt(0)}`.toUpperCase();
    }
    return profile.username.charAt(0).toUpperCase();
  };

  // Nettoyer l'URL de prévisualisation lors du démontage du composant
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo de profil</CardTitle>
        <CardDescription>Modifiez votre photo de profil</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-6">
          {previewUrl ? (
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewUrl} alt="Prévisualisation" />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <ProfileImage
              src={profilePicture}
              alt={profile.username}
              fallback={getInitials()}
              size="xl"
              withCacheBusting={false} // Désactiver le cache-busting ici
            />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        {!previewUrl ? (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            <span>Choisir une image</span>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <LoadingButton
              onClick={handleUpload}
              isLoading={isPending}
              loadingText="Téléchargement..."
            >
              Enregistrer
            </LoadingButton>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4">
          Formats acceptés: JPG, PNG, GIF. Taille maximale: 5Mo.
        </p>
      </CardContent>
    </Card>
  );
}

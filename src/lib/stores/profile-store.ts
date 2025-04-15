import { create } from 'zustand';
import type { UserProfile } from '@/lib/api/hooks/use-profile';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile) => void;
  updateProfilePicture: (url: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  updateProfilePicture: (url) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, profilePicture: url } : null,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

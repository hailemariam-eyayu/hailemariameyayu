import { createContext, useContext } from 'react';
import type { Profile } from '../types';
import { DEFAULT_PROFILE } from '../hooks/useProfile';

interface ProfileContextValue {
  profile: Profile;
  setProfile: (p: Profile) => void;
}

export const ProfileContext = createContext<ProfileContextValue>({
  profile: DEFAULT_PROFILE,
  setProfile: () => {},
});

export function useProfileContext() {
  return useContext(ProfileContext);
}

import { useEffect, useState } from 'react';
import { fetchProfile } from '../api';
import type { Profile } from '../types';

// Fallback so components never crash on null
export const DEFAULT_PROFILE: Profile = {
  id: 1,
  full_name: 'Hailemariam Eyayu',
  tagline: 'Passionate software engineer building modern web and mobile applications.',
  bio: '',
  email: 'hailemariameyayu@gmail.com',
  phone: '',
  telegram: 'https://t.me/hailemariam_eyayu',
  github: 'https://github.com/hailemariam-eyayu',
  location: 'Addis Ababa, Ethiopia',
  degree: 'BSc Software Engineering',
  cgpa: '3.86 / 4.0',
  university: 'Debre Markos University',
  uni_period: 'June 2021 – July 2025',
  current_role: 'Online Banking Technical Officer',
  employer: 'Enat Bank',
  work_period: 'September 2025 – Present',
  languages: 'Amharic, English',
  cv_url: 'https://www.canva.com/design/DAGs2oZ685w/K_xVgJR2cBqwF32pHDof0g/edit',
  resume_path: '/downloads/Hailemariam_Eyayu_Resume.pdf',
  image_url: '/images/HME.png',
  quick_facts: [
    '💡 Clean code & best practices advocate',
    '🌍 Open-source contributor',
    '📱 Cross-platform mobile developer',
    '🔧 Full-stack web engineer',
  ],
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch(() => {/* keep default */})
      .finally(() => setLoading(false));
  }, []);

  return { profile, setProfile, loading };
}

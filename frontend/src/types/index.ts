export interface Project {
  id: number;
  title: string;
  description: string;
  category: 'web' | 'mobile' | 'bot' | string;
  url: string | null;
  live_url: string | null;
  technologies: string[];
}

export interface Stats {
  years_experience: string;
  technologies_count: string;
  completed_projects: string;
  platforms: string;
  satisfied_clients: string;
}

export interface Inquiry {
  name: string;
  email: string;
  message: string;
}

export interface Profile {
  id: number;
  full_name: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  telegram: string;
  github: string;
  location: string;
  degree: string;
  cgpa: string;
  university: string;
  uni_period: string;
  current_role: string;
  employer: string;
  work_period: string;
  languages: string;
  cv_url: string;
  resume_path: string;
  image_url: string;
  quick_facts: string[];
}

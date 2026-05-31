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

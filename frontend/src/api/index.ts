import type { Project, Stats, Inquiry, Profile } from '../types';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// ── Social links ──────────────────────────────────────────────────────────────

export interface SocialLink {
  id: number;
  name: string;
  icon: string;  // fa brand name e.g. "github", "linkedin", or emoji
  url: string;
  sort_order: number;
}

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const res = await fetch(`${BASE_URL}/api/social-links`);
  if (!res.ok) throw new Error('Failed to fetch social links');
  return res.json();
}

export async function addSocialLink(data: { name: string; icon: string; url: string }, passcode: string): Promise<SocialLink> {
  const res = await fetch(`${BASE_URL}/api/social-links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || 'Failed'); }
  return res.json();
}

export async function updateSocialLink(id: number, data: { name: string; icon: string; url: string }, passcode: string): Promise<SocialLink> {
  const res = await fetch(`${BASE_URL}/api/social-links/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || 'Failed'); }
  return res.json();
}

export async function deleteSocialLink(id: number, passcode: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/social-links/${id}`, {
    method: 'DELETE', headers: { 'x-admin-passcode': passcode },
  });
  if (!res.ok) throw new Error('Failed to delete');
}

// ── Image upload (Cloudinary) ─────────────────────────────────────────────────

export async function uploadImage(file: File, passcode: string): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { 'x-admin-passcode': passcode },
    body: formData,
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || 'Upload failed'); }
  const data = await res.json();
  return data.url;
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function fetchProfile(): Promise<Profile> {
  const res = await fetch(`${BASE_URL}/api/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateProfile(data: Partial<Profile>, passcode: string): Promise<Profile> {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to update profile');
  }
  return res.json();
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${BASE_URL}/api/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function addProject(data: Omit<Project, 'id'>, passcode: string): Promise<Project> {
  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to add project');
  }
  return res.json();
}

export async function updateProject(
  id: number,
  data: Partial<Project>,
  passcode: string
): Promise<Project> {
  const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to update project');
  }
  return res.json();
}

export async function deleteProject(id: number, passcode: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-passcode': passcode },
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${BASE_URL}/api/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function updateStats(data: Partial<Stats>, passcode: string): Promise<Stats> {
  const res = await fetch(`${BASE_URL}/api/stats`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to update stats');
  }
  return res.json();
}

// ── Skills ────────────────────────────────────────────────────────────────────

export interface SkillCategory {
  id: number;
  title: string;
  icon: string;
  sort_order: number;
  skills: { id: number; category_id: number; name: string; level: number }[];
}

export async function fetchSkills(): Promise<SkillCategory[]> {
  const res = await fetch(`${BASE_URL}/api/skills`);
  if (!res.ok) throw new Error('Failed to fetch skills');
  return res.json();
}

export async function addSkillCategory(data: { title: string; icon: string }, passcode: string) {
  const res = await fetch(`${BASE_URL}/api/skill-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || 'Failed'); }
  return res.json();
}

export async function updateSkillCategory(id: number, data: { title: string; icon: string }, passcode: string) {
  const res = await fetch(`${BASE_URL}/api/skill-categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || 'Failed'); }
  return res.json();
}

export async function deleteSkillCategory(id: number, passcode: string) {
  const res = await fetch(`${BASE_URL}/api/skill-categories/${id}`, {
    method: 'DELETE', headers: { 'x-admin-passcode': passcode },
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

export async function addSkill(catId: number, data: { name: string; level: number }, passcode: string) {
  const res = await fetch(`${BASE_URL}/api/skill-categories/${catId}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || 'Failed'); }
  return res.json();
}

export async function updateSkill(id: number, data: { name: string; level: number }, passcode: string) {
  const res = await fetch(`${BASE_URL}/api/skills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || 'Failed'); }
  return res.json();
}

export async function deleteSkill(id: number, passcode: string) {
  const res = await fetch(`${BASE_URL}/api/skills/${id}`, {
    method: 'DELETE', headers: { 'x-admin-passcode': passcode },
  });
  if (!res.ok) throw new Error('Failed to delete skill');
}

// ── Technologies ─────────────────────────────────────────────────────────────

export async function fetchTechnologies(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${BASE_URL}/api/technologies`);
  if (!res.ok) throw new Error('Failed to fetch technologies');
  return res.json();
}

export async function addTechnology(name: string, passcode: string) {
  const res = await fetch(`${BASE_URL}/api/technologies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to add');
  }
  return res.json();
}

export async function updateTechnology(id: number, name: string, passcode: string) {
  const res = await fetch(`${BASE_URL}/api/technologies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to update');
  }
  return res.json();
}

export async function deleteTechnology(id: number, passcode: string) {
  const res = await fetch(`${BASE_URL}/api/technologies/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-passcode': passcode },
  });
  if (!res.ok) throw new Error('Failed to delete technology');
}

// ── Admin login ───────────────────────────────────────────────────────────────

export async function adminLogin(passcode: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  return res.ok;
}

// ── Inquiries ─────────────────────────────────────────────────────────────────

export async function submitInquiry(data: Inquiry): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to send message');
  }
}

export async function fetchInquiries(passcode: string) {
  const res = await fetch(`${BASE_URL}/api/inquiries`, {
    headers: { 'x-admin-passcode': passcode },
  });
  if (!res.ok) throw new Error('Failed to fetch inquiries');
  return res.json();
}

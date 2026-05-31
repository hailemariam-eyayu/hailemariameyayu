import type { Project, Stats, Inquiry } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${BASE_URL}/api/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${BASE_URL}/api/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function submitInquiry(data: Inquiry): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send message');
  }
}

import { useState, useEffect } from 'react';
import type { Project } from '../types';

interface Props {
  project: Project | null;
  onClose: () => void;
  onSave: (updated: Project) => void;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function EditProjectModal({ project, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    url: '',
    live_url: '',
    technologies: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title,
        description: project.description ?? '',
        category: project.category,
        url: project.url ?? '',
        live_url: project.live_url ?? '',
        technologies: project.technologies?.join(', ') ?? '',
      });
      setError('');
    }
  }, [project]);

  if (!project) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      url: form.url.trim() || null,
      live_url: form.live_url.trim() || null,
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save');
      }

      const updated: Project = await res.json();
      onSave(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-dark-700 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 id="edit-modal-title" className="text-white font-semibold text-lg">
            Edit Project
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-dark-500 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Project title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Short project description"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="bot">Bot / Automation</option>
            </select>
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
              GitHub URL
            </label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              className="input-field"
              placeholder="https://github.com/..."
              type="url"
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
              Live / Demo URL
            </label>
            <input
              name="live_url"
              value={form.live_url}
              onChange={handleChange}
              className="input-field"
              placeholder="https://..."
              type="url"
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
              Technologies
              <span className="normal-case text-gray-600 ml-1">(comma separated)</span>
            </label>
            <input
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              className="input-field"
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

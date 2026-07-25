import { useState, useEffect } from 'react';
import type { Project } from '../types';
import { adminLogin, updateProject } from '../api';

interface Props {
  project: Project | null;
  onClose: () => void;
  onSave: (updated: Project) => void;
}

export default function EditProjectModal({ project, onClose, onSave }: Props) {
  const [passcode, setPasscode] = useState('');
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');
  const [passcodeLoading, setPasscodeLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', category: '',
    url: '', live_url: '', technologies: '',
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
      // Reset passcode gate when a new project is opened
      setPasscodeVerified(false);
      setPasscode('');
      setPasscodeError('');
    }
  }, [project]);

  if (!project) return null;

  const handlePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setPasscodeLoading(true);
    setPasscodeError('');
    const ok = await adminLogin(passcode.trim());
    setPasscodeLoading(false);
    if (ok) {
      setPasscodeVerified(true);
    } else {
      setPasscodeError('Wrong passcode');
      setPasscode('');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    setError('');
    const payload = {
      title: form.title.trim(), description: form.description.trim(),
      category: form.category.trim(),
      url: form.url.trim() || null, live_url: form.live_url.trim() || null,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      const updated = await updateProject(project.id, payload, passcode);
      onSave(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-dark-700 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold text-lg">Edit Project</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-dark-500 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Passcode gate */}
        {!passcodeVerified ? (
          <form onSubmit={handlePasscode} className="px-6 py-6 space-y-4">
            <div className="text-center">
              <span className="text-3xl">🔒</span>
              <p className="text-gray-400 text-sm mt-2">Enter admin passcode to edit</p>
            </div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
              autoFocus
              className="input-field text-center tracking-widest"
            />
            {passcodeError && <p className="text-red-400 text-sm text-center">{passcodeError}</p>}
            <button type="submit" disabled={passcodeLoading}
              className="btn-primary w-full disabled:opacity-60">
              {passcodeLoading ? 'Checking...' : 'Unlock'}
            </button>
          </form>
        ) : (
          /* Edit form */
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Project title" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="bot">Bot / Automation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">GitHub URL</label>
              <input name="url" value={form.url} onChange={handleChange} className="input-field" type="url" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Live / Demo URL</label>
              <input name="live_url" value={form.live_url} onChange={handleChange} className="input-field" type="url" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
                Technologies <span className="normal-case text-gray-600 ml-1">(comma separated)</span>
              </label>
              <input name="technologies" value={form.technologies} onChange={handleChange} className="input-field" placeholder="React, Node.js, PostgreSQL" />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={saving}
                className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
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
        )}
      </div>
    </div>
  );
}

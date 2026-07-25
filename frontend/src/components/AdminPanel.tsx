import { useState, useEffect } from 'react';
import type { Profile, Project, Stats } from '../types';
import {
  adminLogin, updateProfile, fetchProjects, addProject,
  updateProject, deleteProject, fetchStats, updateStats,
  fetchInquiries, fetchTechnologies, addTechnology,
  updateTechnology, deleteTechnology,
} from '../api';
import { useProfileContext } from '../context/ProfileContext';

// ── Passcode gate ─────────────────────────────────────────────────────────────

function PasscodeGate({ onUnlock }: { onUnlock: (pc: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    setError('');
    const ok = await adminLogin(value.trim());
    setLoading(false);
    if (ok) {
      onUnlock(value.trim());
    } else {
      setError('Wrong passcode. Try again.');
      setValue('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-dark-700 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
            🔒
          </div>
          <h2 className="text-white text-xl font-bold">Admin Access</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your passcode to continue</p>
        </div>
        <form onSubmit={submit} className="px-8 pb-8 pt-6 space-y-4">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Passcode"
            autoFocus
            className="input-field text-center tracking-widest text-lg"
          />
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Shared input components ───────────────────────────────────────────────────

function Field({
  label, name, value, onChange, type = 'text', rows,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
        {label}
      </label>
      {rows ? (
        <textarea
          name={name} value={value} onChange={onChange} rows={rows}
          className="input-field resize-none text-sm"
        />
      ) : (
        <input
          type={type} name={name} value={value} onChange={onChange}
          className="input-field text-sm"
        />
      )}
    </div>
  );
}

// ── Tab: Profile / About ──────────────────────────────────────────────────────

function ProfileTab({ passcode, initialProfile }: { passcode: string; initialProfile: Profile }) {
  const { setProfile } = useProfileContext();
  const [form, setForm] = useState<Profile>({ ...initialProfile });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, image_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleQuickFacts = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter((l) => l.trim());
    setForm((p) => ({ ...p, quick_facts: lines }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const updated = await updateProfile(form, passcode);
      setProfile(updated);
      setMsg('✅ Profile saved!');
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
        <Field label="Location" name="location" value={form.location} onChange={handleChange} />
        <Field label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
        <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Field label="Telegram URL" name="telegram" value={form.telegram} onChange={handleChange} />
        <Field label="GitHub URL" name="github" value={form.github} onChange={handleChange} />
      </div>

      <Field label="Tagline (hero subtitle)" name="tagline" value={form.tagline} onChange={handleChange} rows={2} />
      <Field label="Bio (about section)" name="bio" value={form.bio} onChange={handleChange} rows={5} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Languages" name="languages" value={form.languages} onChange={handleChange} />
        <Field label="Degree" name="degree" value={form.degree} onChange={handleChange} />
        <Field label="CGPA" name="cgpa" value={form.cgpa} onChange={handleChange} />
        <Field label="University" name="university" value={form.university} onChange={handleChange} />
        <Field label="University Period" name="uni_period" value={form.uni_period} onChange={handleChange} />
        <Field label="Job Title" name="job_title" value={(form as any).job_title ?? ''} onChange={handleChange} />
        <Field label="Employer" name="employer" value={form.employer} onChange={handleChange} />
        <Field label="Work Period" name="work_period" value={form.work_period} onChange={handleChange} />
        <Field label="CV URL (View online)" name="cv_url" value={form.cv_url} onChange={handleChange} />
        <Field label="Resume Path (download)" name="resume_path" value={form.resume_path} onChange={handleChange} />
      </div>

      {/* Profile Image Upload */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
          Profile Image
        </label>
        <div className="flex items-center gap-4 p-3 bg-dark-600/40 border border-white/10 rounded-xl">
          <img
            src={form.image_url || '/images/HME.png'}
            alt="Preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-white/10 flex-shrink-0"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/HME.png'; }}
          />
          <div className="flex-1 min-w-0">
            <label className="cursor-pointer inline-flex items-center gap-2 bg-dark-500 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Choose Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <p className="text-xs text-gray-600 mt-1">JPG, PNG, WEBP — saved to DB as base64</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
          Quick Facts <span className="normal-case text-gray-600 ml-1">(one per line)</span>
        </label>
        <textarea
          rows={4}
          className="input-field resize-none text-sm"
          value={form.quick_facts.join('\n')}
          onChange={handleQuickFacts}
          placeholder={'💡 Clean code advocate\n🌍 Open-source contributor'}
        />
      </div>

      {msg && (
        <p className={`text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2 disabled:opacity-60"
      >
        {saving ? 'Saving...' : '💾 Save Profile'}
      </button>
    </div>
  );
}

// ── Tab: Stats ────────────────────────────────────────────────────────────────

function StatsTab({ passcode }: { passcode: string }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchStats().then((s) => {
      setForm({
        years_experience: String(s.years_experience ?? ''),
        technologies_count: String(s.technologies_count ?? ''),
        completed_projects: String(s.completed_projects ?? ''),
        platforms: String(s.platforms ?? ''),
        satisfied_clients: String(s.satisfied_clients ?? ''),
      });
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await updateStats(form as unknown as Stats, passcode);
      setMsg('✅ Stats saved!');
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const labels: Record<string, string> = {
    years_experience: 'Years of Experience',
    technologies_count: 'Technologies',
    completed_projects: 'Completed Projects',
    platforms: 'Platforms',
    satisfied_clients: 'Satisfied Clients',
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.keys(labels).map((key) => (
          <div key={key}>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
              {labels[key]}
            </label>
            <input
              type="number"
              value={form[key] ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              className="input-field text-sm"
            />
          </div>
        ))}
      </div>

      {msg && (
        <p className={`text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2 disabled:opacity-60"
      >
        {saving ? 'Saving...' : '💾 Save Stats'}
      </button>
    </div>
  );
}

// ── Tab: Projects ─────────────────────────────────────────────────────────────

const EMPTY_PROJECT: Omit<Project, 'id'> = {
  title: '', description: '', category: 'web',
  url: null, live_url: null, technologies: [],
};

function ProjectsTab({ passcode }: { passcode: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_PROJECT, url: '', live_url: '', technologies: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchProjects().then(setProjects); }, []);

  const openEdit = (p: Project) => {
    setEditing(p);
    setAdding(false);
    setForm({
      title: p.title, description: p.description ?? '',
      category: p.category, url: p.url ?? '', live_url: p.live_url ?? '',
      technologies: p.technologies?.join(', ') ?? '',
    });
    setMsg('');
  };

  const openAdd = () => {
    setEditing(null);
    setAdding(true);
    setForm({ title: '', description: '', category: 'web', url: '', live_url: '', technologies: '' });
    setMsg('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setMsg('❌ Title is required'); return; }
    setSaving(true);
    setMsg('');
    const payload = {
      title: form.title.trim(), description: form.description.trim(),
      category: form.category,
      url: form.url.trim() || null, live_url: form.live_url.trim() || null,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        const updated = await updateProject(editing.id, payload, passcode);
        setProjects((ps) => ps.map((p) => p.id === updated.id ? updated : p));
        setEditing(updated);
        setMsg('✅ Project updated!');
      } else {
        const created = await addProject(payload, passcode);
        setProjects((ps) => [...ps, created]);
        setAdding(false);
        setMsg('✅ Project added!');
      }
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id, passcode);
    setProjects((ps) => ps.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  return (
    <div className="space-y-4">
      {/* Project list */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${
              editing?.id === p.id
                ? 'border-primary-500/50 bg-primary-500/10'
                : 'border-white/5 bg-dark-600/50 hover:border-white/10'
            }`}
            onClick={() => openEdit(p)}
          >
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{p.title}</p>
              <p className="text-gray-500 text-xs capitalize">{p.category}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
              className="ml-3 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
              aria-label="Delete project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button onClick={openAdd} className="btn-outline text-sm flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add New Project
      </button>

      {/* Edit / Add form */}
      {(editing || adding) && (
        <div className="border border-white/10 rounded-xl p-5 space-y-4 bg-dark-600/30">
          <h3 className="text-white font-semibold text-sm">
            {adding ? 'Add New Project' : `Edit: ${editing?.title}`}
          </h3>

          <div className="space-y-3">
            <Field label="Title *" name="title" value={form.title} onChange={handleChange} />
            <Field label="Description" name="description" value={form.description} onChange={handleChange} rows={3} />
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field text-sm">
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="bot">Bot / Automation</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="GitHub URL" name="url" value={form.url} onChange={handleChange} />
              <Field label="Live URL" name="live_url" value={form.live_url} onChange={handleChange} />
            </div>
            <Field label="Technologies (comma separated)" name="technologies" value={form.technologies} onChange={handleChange} />
          </div>

          {msg && (
            <p className={`text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setEditing(null); setAdding(false); setMsg(''); }}
              className="btn-outline text-sm flex-1 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-sm flex-1 py-2 disabled:opacity-60"
            >
              {saving ? 'Saving...' : '💾 Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Inquiries ────────────────────────────────────────────────────────────

function InquiriesTab({ passcode }: { passcode: string }) {
  const [inquiries, setInquiries] = useState<{ id: number; name: string; email: string; message: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries(passcode)
      .then(setInquiries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [passcode]);

  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (inquiries.length === 0) return <p className="text-gray-500 text-sm">No inquiries yet.</p>;

  return (
    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
      {inquiries.map((inq) => (
        <div key={inq.id} className="border border-white/5 bg-dark-600/40 rounded-xl px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white text-sm font-semibold">{inq.name}</p>
              <a href={`mailto:${inq.email}`} className="text-primary-400 text-xs hover:underline">{inq.email}</a>
            </div>
            <span className="text-gray-600 text-xs flex-shrink-0">
              {new Date(inq.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">{inq.message}</p>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Technologies ─────────────────────────────────────────────────────────

function TechnologiesTab({ passcode }: { passcode: string }) {
  const [techs, setTechs] = useState<{ id: number; name: string }[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchTechnologies().then(setTechs).catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setMsg('');
    try {
      const created = await addTechnology(newName.trim(), passcode);
      setTechs((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName('');
      setMsg('✅ Added!');
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Error'));
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;
    setMsg('');
    try {
      const updated = await updateTechnology(id, editingName.trim(), passcode);
      setTechs((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
      setMsg('✅ Updated!');
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Error'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this technology?')) return;
    setMsg('');
    try {
      await deleteTechnology(id, passcode);
      setTechs((prev) => prev.filter((t) => t.id !== id));
      setMsg('✅ Deleted!');
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Add new */}
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New technology name..."
          className="input-field flex-1 text-sm"
        />
        <button onClick={handleAdd} className="btn-primary px-4 text-sm whitespace-nowrap">
          + Add
        </button>
      </div>

      {msg && (
        <p className={`text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
      )}

      {/* List */}
      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
        {techs.map((tech) => (
          <div key={tech.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-dark-600/40 group">
            {editingId === tech.id ? (
              <>
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate(tech.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="input-field flex-1 text-sm py-1"
                />
                <button
                  onClick={() => handleUpdate(tech.id)}
                  className="text-green-400 hover:text-green-300 text-xs font-semibold px-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:text-gray-300 text-xs px-1"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-300">{tech.name}</span>
                <button
                  onClick={() => { setEditingId(tech.id); setEditingName(tech.name); setMsg(''); }}
                  className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition-all p-1"
                  aria-label="Edit"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(tech.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1"
                  aria-label="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600">{techs.length} technologies • hover to edit/delete</p>
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'profile',      label: '👤 About & Contact' },
  { id: 'stats',        label: '📊 Stats' },
  { id: 'projects',     label: '🚀 Projects' },
  { id: 'technologies', label: '🛠️ Technologies' },
  { id: 'inquiries',    label: '📬 Inquiries' },
];

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { profile } = useProfileContext();
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  if (!passcode) {
    return <PasscodeGate onUnlock={setPasscode} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-sm">
              ⚙️
            </div>
            <h2 className="text-white font-bold text-lg">Admin Panel</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-dark-600 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 flex-shrink-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-400 border-b-2 border-primary-500 -mb-px'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile'      && <ProfileTab      passcode={passcode} initialProfile={profile} />}
          {activeTab === 'stats'        && <StatsTab        passcode={passcode} />}
          {activeTab === 'projects'     && <ProjectsTab     passcode={passcode} />}
          {activeTab === 'technologies' && <TechnologiesTab passcode={passcode} />}
          {activeTab === 'inquiries'    && <InquiriesTab    passcode={passcode} />}
        </div>
      </div>
    </div>
  );
}

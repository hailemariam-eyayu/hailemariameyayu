import { useState } from 'react';
import { submitInquiry } from '../api';
import { useReveal } from '../hooks/useReveal';
import { useProfileContext } from '../context/ProfileContext';

interface FormState { name: string; email: string; message: string; }
interface FormErrors { name?: string; email?: string; message?: string; }

export default function Contact() {
  const titleRef = useReveal();
  const formRef = useReveal();
  const { profile } = useProfileContext();

  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      await submitInquiry(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setErrors({});
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status !== 'idle') setStatus('idle');
  };

  const telegramHandle = profile.telegram?.includes('t.me/')
    ? '@' + profile.telegram.split('t.me/').pop()
    : profile.telegram;

  const githubHandle = profile.github?.includes('github.com/')
    ? 'github.com/' + profile.github.split('github.com/').pop()
    : profile.github;

  const contactCards = [
    profile.email && {
      icon: '📧', label: 'Email',
      href: `mailto:${profile.email}`, text: profile.email,
    },
    profile.phone && {
      icon: '📞', label: 'Phone',
      href: `tel:${profile.phone}`, text: profile.phone,
    },
    profile.telegram && {
      icon: '💬', label: 'Telegram',
      href: profile.telegram, text: telegramHandle, external: true,
    },
    profile.github && {
      icon: '🐙', label: 'GitHub',
      href: profile.github, text: githubHandle, external: true,
    },
    profile.location && {
      icon: '📍', label: 'Location',
      href: null, text: profile.location,
    },
  ].filter(Boolean) as { icon: string; label: string; href: string | null; text: string; external?: boolean }[];

  return (
    <section id="contact" className="py-24 max-w-6xl mx-auto px-6">
      <div ref={titleRef} className="reveal text-center mb-16">
        <p className="section-subtitle">// let's talk</p>
        <h2 className="section-title">Get In Touch</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full mx-auto mt-4" />
        <p style={{ color: 'var(--text-muted)' }} className="mt-4 max-w-lg mx-auto">
          Have a project in mind or want to collaborate? I'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-4">
          {contactCards.map((card) => (
            <div key={card.label} className="card glow-on-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-xl flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <p style={{ color: 'var(--text-subtle)' }} className="text-sm">{card.label}</p>
                  {card.href ? (
                    <a href={card.href} target={card.external ? '_blank' : undefined}
                      rel={card.external ? 'noopener noreferrer' : undefined}
                      className="font-medium transition-colors" style={{ color: 'var(--accent-light)' }}>
                      {card.text}
                    </a>
                  ) : (
                    <p className="font-medium" style={{ color: 'var(--text)' }}>{card.text}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div ref={formRef} className="reveal">
          <form onSubmit={handleSubmit} noValidate className="card space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Your Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
                placeholder={profile.full_name}
                className={`input-field ${errors.name ? 'border-red-500/60' : ''}`} />
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-500/60' : ''}`} />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Message</label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange}
                placeholder="Tell me about your project..."
                className={`input-field resize-none ${errors.message ? 'border-red-500/60' : ''}`} />
              {errors.message && <p className="text-red-400 text-xs mt-1.5">{errors.message}</p>}
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <span className="text-green-400 text-lg">✅</span>
                <p className="text-green-400 text-sm font-medium">Message sent! I'll get back to you soon.</p>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <span className="text-red-400 text-lg">❌</span>
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </div>
            )}

            <button type="submit" disabled={status === 'loading'}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {status === 'loading' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { submitInquiry, fetchSocialLinks } from '../api';
import { useReveal } from '../hooks/useReveal';
import { useProfileContext } from '../context/ProfileContext';
import type { SocialLink } from '../api';

interface FormState { name: string; email: string; message: string; }
interface FormErrors { name?: string; email?: string; message?: string; }

const SOCIAL_ICONS: Record<string, string> = {
  github:    'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z',
  telegram:  'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  linkedin:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  twitter:   'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
};

function SocialChip({ icon }: { icon: string }) {
  const path = SOCIAL_ICONS[icon.toLowerCase()];
  if (path) {
    return (
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    );
  }
  return <span className="text-base leading-none">{icon}</span>;
}

export default function Contact() {
  const titleRef = useReveal();
  const formRef = useReveal();
  const { profile } = useProfileContext();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchSocialLinks().then(setSocialLinks).catch(() => {});
  }, []);

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

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="card">
              <p className="text-xs uppercase tracking-wider font-medium mb-3" style={{ color: 'var(--text-subtle)' }}>Find me on</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                    style={{ background: 'var(--card-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  >
                    <SocialChip icon={link.icon} />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}
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

import { useState } from 'react';
import { submitInquiry } from '../api';
import { useReveal } from '../hooks/useReveal';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const titleRef = useReveal();
  const formRef = useReveal();

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
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status !== 'idle') setStatus('idle');
  };

  return (
    <section id="contact" className="py-24 max-w-6xl mx-auto px-6">
      <div ref={titleRef} className="reveal text-center mb-16">
        <p className="section-subtitle">// let's talk</p>
        <h2 className="section-title">Get In Touch</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full mx-auto mt-4" />
        <p className="text-gray-400 mt-4 max-w-lg mx-auto">
          Have a project in mind or want to collaborate? I'd love to hear from you. Send me a message
          and I'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="card glow-on-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-xl">
                📧
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <a
                  href="mailto:hailemariameyayu@gmail.com"
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  hailemariameyayu@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="card glow-on-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-xl">
                💬
              </div>
              <div>
                <p className="text-gray-500 text-sm">Telegram</p>
                <a
                  href="https://t.me/hailemariam_eyayu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  @hailemariam_eyayu
                </a>
              </div>
            </div>
          </div>

          <div className="card glow-on-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-xl">
                🐙
              </div>
              <div>
                <p className="text-gray-500 text-sm">GitHub</p>
                <a
                  href="https://github.com/hailemariam-eyayu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  github.com/hailemariam-eyayu
                </a>
              </div>
            </div>
          </div>

          <div className="card glow-on-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-xl">
                📍
              </div>
              <div>
                <p className="text-gray-500 text-sm">Location</p>
                <p className="text-white font-medium">Ethiopia 🇪🇹</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div ref={formRef} className="reveal">
          <form onSubmit={handleSubmit} noValidate className="card space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm text-gray-400 mb-2 font-medium">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Hailemariam Eyayu"
                className={`input-field ${errors.name ? 'border-red-500/60 focus:border-red-500/60' : ''}`}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-red-400 text-xs mt-1.5">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-2 font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-500/60 focus:border-red-500/60' : ''}`}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-400 text-xs mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-gray-400 mb-2 font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                className={`input-field resize-none ${errors.message ? 'border-red-500/60 focus:border-red-500/60' : ''}`}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-red-400 text-xs mt-1.5">
                  {errors.message}
                </p>
              )}
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <span className="text-green-400 text-lg">✅</span>
                <p className="text-green-400 text-sm font-medium">
                  Message sent successfully! I'll get back to you soon.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <span className="text-red-400 text-lg">❌</span>
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
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

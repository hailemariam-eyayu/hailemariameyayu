import { useEffect, useState } from 'react';
import { useProfileContext } from '../context/ProfileContext';

const ROLES = [
  'Full-Stack Developer',
  'Mobile App Developer',
  'Flutter & Dart Expert',
  'React & Next.js Dev',
  'Laravel & PHP Engineer',
];

export default function Hero() {
  const { profile } = useProfileContext();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  const firstName = profile.full_name.split(' ')[0] || 'Hailemariam';
  const telegramHandle = profile.telegram?.replace('https://t.me/', '@') ?? '';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse-slow animate-delay-300" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-dark-600 border border-white/10 rounded-full px-4 py-2 mb-8">
            <span className="glow-dot" />
            <span className="text-sm text-gray-400">Available for work</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            Hi, I'm{' '}
            <span className="text-gradient">{firstName}</span>
          </h1>

          <div className="text-2xl md:text-3xl font-semibold text-gray-300 mb-6 h-10">
            <span className="typing-cursor">{displayed}</span>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
            {profile.tagline}
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-7 7m7-7l-7-7" />
              </svg>
              View Projects
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in Touch
            </button>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4 mt-10 justify-center lg:justify-start">
            <span className="text-gray-600 text-sm">Find me on</span>
            <div className="flex gap-3">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-dark-600 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-500/50 transition-all duration-200"
                  aria-label="GitHub">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {profile.telegram && (
                <a href={profile.telegram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-dark-600 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-500/50 transition-all duration-200"
                  aria-label="Telegram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="w-9 h-9 rounded-lg bg-dark-600 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-500/50 transition-all duration-200"
                  aria-label="Email">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0 animate-slide-up animate-delay-200">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-blue-400 blur-2xl opacity-30 scale-110 animate-pulse-slow" />
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary-500/30 shadow-2xl shadow-primary-500/20">
              <img
                src={profile.image_url || '/images/HME.png'}
                alt={profile.full_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('bg-gradient-to-br', 'from-primary-700', 'to-blue-800', 'flex', 'items-center', 'justify-center');
                    const initials = profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                    parent.innerHTML = `<span class="text-6xl font-black text-white">${initials}</span>`;
                  }
                }}
              />
            </div>

            <div className="absolute -top-4 -right-4 bg-dark-600 border border-white/10 rounded-xl px-3 py-2 shadow-xl animate-float">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="text-xs text-gray-400">Experience</div>
                  <div className="text-sm font-bold text-white">5+ Years</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-dark-600 border border-white/10 rounded-xl px-3 py-2 shadow-xl animate-float animate-delay-300">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <div>
                  <div className="text-xs text-gray-400">Projects</div>
                  <div className="text-sm font-bold text-white">10+ Done</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-gray-600">Scroll down</span>
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

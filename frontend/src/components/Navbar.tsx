import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { id: 'about',        label: 'About' },
  { id: 'skills',       label: 'Skills' },
  { id: 'projects',     label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact',      label: 'Contact' },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [active,    setActive]    = useState('');
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = NAV_ITEMS.map((i) => document.getElementById(i.id));
      let current = '';
      sections.forEach((s) => {
        if (s && s.getBoundingClientRect().top <= 100) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-glass bg-glass-dark ${
        scrolled ? 'shadow-xl shadow-black/20 border-b' : ''
      }`}
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white text-sm group-hover:bg-primary-500 transition-colors">
            HE
          </div>
          <span className="font-bold text-lg hidden sm:block" style={{ color: 'var(--text)' }}>
            Hailemariam<span style={{ color: 'var(--accent-light)' }}>.</span>
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button onClick={() => scrollTo(item.id)} className={`nav-link ${active === item.id ? 'active' : ''}`}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA + theme toggle + mobile toggle */}
        <div className="flex items-center gap-3">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <a
            href="https://www.canva.com/design/DAGs2oZ685w/K_xVgJR2cBqwF32pHDof0g/edit"
            target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-primary text-sm py-2 px-4"
          >
            View CV
          </a>

          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            <span className={`block w-5 h-0.5 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: 'var(--text)' }} />
            <span className={`block w-5 h-0.5 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}         style={{ background: 'var(--text)' }} />
            <span className={`block w-5 h-0.5 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: 'var(--text)' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-glass bg-glass-dark border-t overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ borderColor: 'var(--border)' }}
      >
        <ul className="px-6 py-4 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button onClick={() => scrollTo(item.id)} className={`nav-link text-base ${active === item.id ? 'active' : ''}`}>
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href="https://www.canva.com/design/DAGs2oZ685w/K_xVgJR2cBqwF32pHDof0g/edit"
              target="_blank" rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-4 inline-flex"
            >
              View CV
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

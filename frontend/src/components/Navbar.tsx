import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      let current = '';
      sections.forEach((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) current = section.id;
        }
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-glass border-b border-white/5 shadow-xl shadow-black/20' : 'bg-transparent'
      }`}
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
          <span className="font-bold text-white text-lg hidden sm:block">
            Hailemariam<span className="text-primary-400">.</span>
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`nav-link ${active === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.canva.com/design/DAGs2oZ685w/K_xVgJR2cBqwF32pHDof0g/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-primary text-sm py-2 px-4"
          >
            View CV
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-glass border-t border-white/5 overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="px-6 py-4 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`nav-link text-base ${active === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href="https://www.canva.com/design/DAGs2oZ685w/K_xVgJR2cBqwF32pHDof0g/edit"
              target="_blank"
              rel="noopener noreferrer"
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

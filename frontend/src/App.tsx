import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { fetchProjects, fetchStats } from './api';
import { useProfile } from './hooks/useProfile';
import { ProfileContext } from './context/ProfileContext';
import type { Project, Stats } from './types';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const { profile, setProfile } = useProfile();

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoadingProjects(false));

    fetchStats()
      .then(setStats)
      .catch(console.error);
  }, []);

  // Secret keyboard shortcut: Ctrl+Shift+A opens admin panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <Hero />
        <StatsBar stats={stats} />
        <About />
        <Skills />
        <Projects
          projects={projects}
          loading={loadingProjects}
          onProjectUpdated={(updated) =>
            setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
          }
        />
        <Certificates />
        <Contact />
        <Footer onOpenAdmin={() => setAdminOpen(true)} />

        {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
      </div>
    </ProfileContext.Provider>
  );
}

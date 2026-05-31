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
import { fetchProjects, fetchStats } from './api';
import type { Project, Stats } from './types';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoadingProjects(false));

    fetchStats()
      .then(setStats)
      .catch(console.error);
  }, []);

  const handleProjectUpdated = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <Hero />
      <StatsBar stats={stats} />
      <About />
      <Skills />
      <Projects projects={projects} loading={loadingProjects} onProjectUpdated={handleProjectUpdated} />
      <Certificates />
      <Contact />
      <Footer />
    </div>
  );
}

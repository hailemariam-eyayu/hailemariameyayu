import { useState } from 'react';
import type { Project } from '../types';
import { useReveal } from '../hooks/useReveal';
import EditProjectModal from './EditProjectModal';

interface Props {
  projects: Project[];
  loading: boolean;
  onProjectUpdated: (updated: Project) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  web: 'Web',
  mobile: 'Mobile',
  bot: 'Bot / Automation',
};

const CATEGORY_ICONS: Record<string, string> = {
  web: '🌐',
  mobile: '📱',
  bot: '🤖',
};

function ProjectCard({
  project,
  onEdit,
}: {
  project: Project;
  onEdit: (p: Project) => void;
}) {
  const ref = useReveal();

  return (
    <div ref={ref} className="reveal card glow-on-hover flex flex-col h-full group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-xl">
          {CATEGORY_ICONS[project.category] || '💻'}
        </div>

        <div className="flex gap-2">
          {/* Edit button */}
          <button
            onClick={() => onEdit(project)}
            className="icon-btn hover:text-yellow-500"
            aria-label="Edit project"
            title="Edit project details"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* GitHub button */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              aria-label="GitHub repository"
              title="View source code on GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}

          {/* Live demo button */}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn hover:text-green-500"
              aria-label="Live demo"
              title="View live demo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors" style={{ color: 'var(--text)' }}>
        {project.title}
      </h3>
      <p className="text-sm leading-relaxed flex-grow mb-4" style={{ color: 'var(--text-muted)' }}>
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.technologies?.map((tech) => (
          <span key={tech} className="tag">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-dark-500 mb-4" />
      <div className="h-5 bg-dark-500 rounded w-3/4 mb-2" />
      <div className="h-4 bg-dark-500 rounded w-full mb-1" />
      <div className="h-4 bg-dark-500 rounded w-5/6 mb-4" />
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-dark-500 rounded" />
        <div className="h-5 w-12 bg-dark-500 rounded" />
        <div className="h-5 w-20 bg-dark-500 rounded" />
      </div>
    </div>
  );
}

export default function Projects({ projects, loading, onProjectUpdated }: Props) {
  const [filter, setFilter] = useState('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const titleRef = useReveal();

  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 max-w-6xl mx-auto px-6">
      <div ref={titleRef} className="reveal text-center mb-12">
        <p className="section-subtitle">// what i've built</p>
        <h2 className="section-title">Projects</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full mx-auto mt-4" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`filter-pill ${filter === cat ? 'active' : ''}`}
          >
            {CATEGORY_LABELS[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={setEditingProject}
              />
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <div className="text-4xl mb-4">🔍</div>
          <p>No projects found in this category.</p>
        </div>
      )}

      {/* Edit modal */}
      <EditProjectModal
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onSave={onProjectUpdated}
      />
    </section>
  );
}

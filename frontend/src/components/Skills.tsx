import { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { fetchSkills, fetchTechnologies } from '../api';
import type { SkillCategory } from '../api';

const DEFAULT_CATEGORIES: SkillCategory[] = [
  { id: 0, title: 'Backend & APIs', icon: '⚙️', sort_order: 0,
    skills: [{ id:0, category_id:0, name:'Express.js', level:92 },{ id:1, category_id:0, name:'Laravel / PHP', level:85 },{ id:2, category_id:0, name:'Node.js', level:72 },{ id:3, category_id:0, name:'REST APIs', level:75 }] },
  { id: 1, title: 'Databases', icon: '🗄️', sort_order: 1,
    skills: [{ id:4, category_id:1, name:'PostgreSQL', level:84 },{ id:5, category_id:1, name:'MySQL', level:75 },{ id:6, category_id:1, name:'MongoDB', level:65 },{ id:7, category_id:1, name:'SQLite', level:70 }] },
  { id: 2, title: 'Frontend Web', icon: '🌐', sort_order: 2,
    skills: [{ id:8, category_id:2, name:'React', level:76 },{ id:9, category_id:2, name:'Next.js', level:70 },{ id:10, category_id:2, name:'Tailwind CSS', level:78 },{ id:11, category_id:2, name:'TypeScript', level:65 }] },
  { id: 3, title: 'Mobile Development', icon: '📱', sort_order: 3,
    skills: [{ id:12, category_id:3, name:'Flutter', level:74 },{ id:13, category_id:3, name:'Dart', level:72 },{ id:14, category_id:3, name:'React Native', level:30 },{ id:15, category_id:3, name:'Expo', level:25 }] },
];

function SkillBar({ name, level }: { name: string; level: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-theme font-medium">{name}</span>
        <span className="text-xs font-mono" style={{ color: 'var(--accent-light)' }}>{level}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-bar" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const titleRef = useReveal();
  const [categories, setCategories] = useState<SkillCategory[]>(DEFAULT_CATEGORIES);
  const [techBadges, setTechBadges] = useState<string[]>([]);

  useEffect(() => {
    fetchSkills()
      .then(setCategories)
      .catch(() => {});

    fetchTechnologies()
      .then((data) => setTechBadges(data.map((t) => t.name)))
      .catch(() => {});
  }, []);

  return (
    <section id="skills" className="py-24 app-surface transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={titleRef} className="reveal text-center mb-16">
          <p className="section-subtitle">// what i work with</p>
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="section-divider mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categories.map((cat) => (
            <div key={cat.id} className="card">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-theme font-semibold">{cat.title}</h3>
              </div>
              <div className="space-y-4">
                {cat.skills.map((skill) => (
                  <SkillBar key={skill.id} name={skill.name} level={skill.level} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {techBadges.length > 0 && (
          <div className="text-center">
            <p className="text-subtle text-sm mb-6 uppercase tracking-wider">All Technologies</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {techBadges.map((tech) => (
                <span key={tech} className="skill-badge">{tech}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

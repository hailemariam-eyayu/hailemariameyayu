import { useReveal } from '../hooks/useReveal';

const SKILL_CATEGORIES = [
  {
    title: 'Backend & APIs',
    icon: '⚙️',
    skills: [
      { name: 'Express.js', level: 92 },
      { name: 'Laravel / PHP', level: 85 },
      { name: 'Node.js', level: 72 },
      { name: 'REST APIs', level: 75 },
    ],
  },
  {
    title: 'Databases',
    icon: '🗄️',
    skills: [
      { name: 'PostgreSQL', level: 84 },
      { name: 'MySQL', level: 75 },
      { name: 'MongoDB', level: 65 },
      { name: 'SQLite', level: 70 },
    ],
  },
  {
    title: 'Frontend Web',
    icon: '🌐',
    skills: [
      { name: 'React', level: 76 },
      { name: 'Next.js', level: 70 },
      { name: 'Tailwind CSS', level: 78 },
      { name: 'TypeScript', level: 65 },
    ],
  },
  {
    title: 'Mobile Development',
    icon: '📱',
    skills: [
      { name: 'Flutter', level: 74 },
      { name: 'Dart', level: 72 },
      { name: 'React Native', level: 30 },
      { name: 'Expo', level: 25 },
    ],
  },
];

const TECH_BADGES = [
  'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js',
  'Flutter', 'Dart', 'Laravel', 'PHP', 'Node.js', 'Express.js',
  'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Git', 'Docker',
  'Tailwind CSS', 'Bootstrap', 'Figma', 'REST API', 'GraphQL', 'CI/CD',
];

function SkillBar({ name, level }: { name: string; level: number }) {
  const ref = useReveal();

  return (
    <div ref={ref} className="reveal">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-gray-300 font-medium">{name}</span>
        <span className="text-xs text-primary-400 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-600 to-blue-400 rounded-full skill-bar"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const titleRef = useReveal();

  return (
    <section id="skills" className="py-24 bg-dark-800/30">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={titleRef} className="reveal text-center mb-16">
          <p className="section-subtitle">// what i work with</p>
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full mx-auto mt-4" />
        </div>

        {/* Skill bars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.title} className="card">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-white font-semibold">{cat.title}</h3>
              </div>
              <div className="space-y-4">
                {cat.skills.map((skill) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech badges */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider">All Technologies</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {TECH_BADGES.map((tech) => (
              <span key={tech} className="skill-badge">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

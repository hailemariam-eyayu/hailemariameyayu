import { useReveal } from '../hooks/useReveal';
import { useProfileContext } from '../context/ProfileContext';

export default function About() {
  const ref = useReveal();
  const { profile } = useProfileContext();

  const infoGrid = [
    { label: 'Name',         value: profile.full_name },
    { label: 'Degree',       value: profile.degree },
    { label: 'CGPA',         value: profile.cgpa },
    { label: 'University',   value: profile.university },
    { label: 'Current Role', value: (profile as any).job_title ?? (profile as any).current_role },
    { label: 'Employer',     value: profile.employer },
    { label: 'Location',     value: profile.location },
    { label: 'Languages',    value: profile.languages },
  ].filter((item) => item.value);

  return (
    <section id="about" className="py-24 max-w-6xl mx-auto px-6">
      <div ref={ref} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div>
          <p className="section-subtitle">// who am i</p>
          <h2 className="section-title">About Me</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full mb-8" />

          <div className="space-y-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {profile.bio
              ? profile.bio.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)
              : (
                <p>
                  Hello! I'm <span className="font-semibold" style={{ color: 'var(--text)' }}>{profile.full_name}</span>,
                  a Software Engineer based in{' '}
                  <span style={{ color: 'var(--accent-light)' }}>{profile.location}</span>.
                </p>
              )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {infoGrid.map(({ label, value }) => (
              <div key={label}>
                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>{label}</span>
                <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4 flex-wrap">
            {profile.cv_url && (
              <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">View CV</a>
            )}
            {profile.resume_path && (
              <a href={profile.resume_path} download className="btn-outline text-sm">Download Resume</a>
            )}
          </div>
        </div>

        {/* Right: cards */}
        <div className="space-y-4">
          <div className="card glow-on-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-2xl flex-shrink-0">🎓</div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Education</h3>
                <p className="text-sm font-medium" style={{ color: 'var(--accent-light)' }}>{profile.degree} · CGPA {profile.cgpa}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{profile.university} · {profile.uni_period}</p>
              </div>
            </div>
          </div>

          <div className="card glow-on-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-600/20 border border-green-500/20 flex items-center justify-center text-2xl flex-shrink-0">🏦</div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Current Role</h3>
                <p className="text-sm font-medium text-green-400">{(profile as any).job_title ?? (profile as any).current_role}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{profile.employer} · {profile.work_period}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="glow-dot w-1.5 h-1.5" />
                  <span className="text-xs text-green-400">Full Time · Onsite</span>
                </div>
              </div>
            </div>
          </div>

          {profile.quick_facts?.length > 0 && (
            <div className="card glow-on-hover">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Quick Facts</h3>
              <ul className="space-y-3">
                {profile.quick_facts.map((fact, i) => {
                  const [icon, ...rest] = fact.split(' ');
                  return (
                    <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span>{icon}</span>
                      <span>{rest.join(' ') || icon}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

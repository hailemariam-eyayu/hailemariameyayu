import { useReveal } from '../hooks/useReveal';

export default function About() {
  const ref = useReveal();

  return (
    <section id="about" className="py-24 max-w-6xl mx-auto px-6">
      <div ref={ref} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div>
          <p className="section-subtitle">// who am i</p>
          <h2 className="section-title">About Me</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full mb-8" />

          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Hello! I'm <span className="text-white font-semibold">Hailemariam Eyayu</span>, a
              Software Engineer and Full-Stack Developer based in{' '}
              <span className="text-primary-400">Addis Ababa, Ethiopia</span>. I hold a BSc in
              Software Engineering from{' '}
              <span className="text-primary-400">Debre Markos University</span> with a distinguished
              CGPA of <span className="text-white font-semibold">3.86</span>.
            </p>
            <p>
              I currently work as an{' '}
              <span className="text-white font-semibold">Online Banking Technical Officer</span> at{' '}
              <span className="text-primary-400">Enat Bank</span>, where I bridge robust backend
              logic with seamless digital banking experiences. I specialize in Laravel, Flutter, and
              Next.js, and manage PostgreSQL, MSSQL, and MySQL databases.
            </p>
            <p>
              I'm passionate about clean code, efficient architecture, and solving complex problems —
              from academic management systems to community platforms like{' '}
              <span className="text-primary-400">Gitsawe</span>.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: 'Name', value: 'Hailemariam Eyayu' },
              { label: 'Degree', value: 'BSc Software Engineering' },
              { label: 'CGPA', value: '3.86 / 4.0' },
              { label: 'University', value: 'Debre Markos University' },
              { label: 'Current Role', value: 'Online Banking Tech Officer' },
              { label: 'Employer', value: 'Enat Bank' },
              { label: 'Location', value: 'Addis Ababa, Ethiopia 🇪🇹' },
              { label: 'Languages', value: 'Amharic, English' },
            ].map(({ label, value }) => (
              <div key={label}>
                <span className="text-xs text-gray-600 uppercase tracking-wider">{label}</span>
                <p className="text-sm text-gray-300 font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <a
              href="https://www.canva.com/design/DAGs2oZ685w/K_xVgJR2cBqwF32pHDof0g/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              View CV
            </a>
            <a
              href="/downloads/Hailemariam_Eyayu_Resume.pdf"
              download
              className="btn-outline text-sm"
            >
              Download Resume
            </a>
          </div>
        </div>

        {/* Right: collaborator + education cards */}
        <div className="space-y-4">
          {/* Education card */}
          <div className="card glow-on-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                🎓
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Education</h3>
                <p className="text-primary-400 text-sm font-medium">BSc Software Engineering · CGPA 3.86</p>
                <p className="text-gray-500 text-sm">Debre Markos University · June 2021 – July 2025</p>
              </div>
            </div>
          </div>

          {/* Work card */}
          <div className="card glow-on-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-600/20 border border-green-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                🏦
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Current Role</h3>
                <p className="text-green-400 text-sm font-medium">Online Banking Technical Officer</p>
                <p className="text-gray-500 text-sm">Enat Bank · September 2025 – Present</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="glow-dot w-1.5 h-1.5" />
                  <span className="text-xs text-green-400">Full Time · Onsite</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <div className="card glow-on-hover">
            <h3 className="text-white font-semibold mb-4">Quick Facts</h3>
            <ul className="space-y-3">
              {[
                { icon: '💡', text: 'Clean code & best practices advocate' },
                { icon: '🌍', text: 'Open-source contributor' },
                { icon: '📱', text: 'Cross-platform mobile developer' },
                { icon: '🔧', text: 'Full-stack web engineer' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-gray-400 text-sm">
                  <span>{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

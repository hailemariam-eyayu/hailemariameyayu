import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const CERTS = [
  // --- Udacity / 5 Million Ethiopian Coders ---
  {
    title: 'Data Analysis Fundamentals',
    issuer: '5 Million Ethiopian Coders (Udacity)',
    date: 'January 2026',
    description: 'Data science workflow using Python — data cleaning, EDA, and visualization with Pandas, NumPy, and Matplotlib.',
    icon: '📊',
    color: 'from-blue-600/20 to-cyan-600/10',
    border: 'border-blue-500/20',
    badge: 'Data Science',
    liveUrl: 'https://www.udacity.com/certificate/e/477f40e6-fef3-11f0-9a10-a788abb753c3',
    file: null,
  },
  {
    title: 'Artificial Intelligence Fundamentals',
    issuer: '5 Million Ethiopian Coders (Udacity)',
    date: 'January 2026',
    description: 'Core concepts of Machine Learning and AI — building models, neural networks, and ethics of AI for intelligent application features.',
    icon: '🤖',
    color: 'from-violet-600/20 to-purple-600/10',
    border: 'border-violet-500/20',
    badge: 'AI / ML',
    liveUrl: 'https://www.udacity.com/certificate/e/fd8e4dce-fef2-11f0-9217-cbfe76effe13',
    file: null,
  },
  {
    title: 'Android Developer Fundamentals',
    issuer: '5 Million Ethiopian Coders (Udacity)',
    date: 'October 2025',
    description: 'Mobile app development with Kotlin and Android Studio — UI design, background tasks, SQLite integration, and Play Store deployment.',
    icon: '📱',
    color: 'from-green-600/20 to-emerald-600/10',
    border: 'border-green-500/20',
    badge: 'Mobile Dev',
    liveUrl: 'https://www.udacity.com/certificate/e/6bd68c30-a8e8-11f0-815e-f32226b60a26',
    file: null,
  },
  {
    title: 'Programming Fundamentals',
    issuer: '5 Million Ethiopian Coders (Udacity)',
    date: 'October 2025',
    description: 'Core programming skills — data structures, algorithms, version control (Git), and clean code practices for scalable systems.',
    icon: '💻',
    color: 'from-yellow-600/20 to-orange-600/10',
    border: 'border-yellow-500/20',
    badge: 'Programming',
    liveUrl: 'https://www.udacity.com/certificate/e/dbf78e5c-ff31-11f0-ac6d-93989d3270fb',
    file: null,
  },
  // --- Enat Bank ---
  {
    title: 'Understanding of Phishing',
    issuer: 'Enat Bank SC',
    date: 'October 2025',
    description: 'Cybersecurity training focused on phishing awareness — threat identification, digital defense, risk mitigation, and security compliance in banking.',
    icon: '🛡️',
    color: 'from-red-600/20 to-rose-600/10',
    border: 'border-red-500/20',
    badge: 'Cybersecurity',
    liveUrl: 'https://media.licdn.com/dms/image/v2/D4E2DAQFvRUCfW-V5xg/profile-treasury-image-shrink_1920_1920/B4EZnoM3trKkAc-/0/1760537314937?e=1780830000&v=beta&t=T29Ab1ZMgV4QEoSGcNezxud16kdyDgjKowEGKUmn1FQ',
    file: null,
  },
  // --- DMU with MOE (SSH suite) ---
  {
    title: 'SSH Suite — How to Study Effectively',
    issuer: 'DMU with MOE',
    date: 'November 2024',
    description: 'Scientific strategies for rapid skill acquisition — critical reading, active note-taking, and memory retention techniques.',
    icon: '📖',
    color: 'from-teal-600/20 to-cyan-600/10',
    border: 'border-teal-500/20',
    badge: 'SSH Suite',
    liveUrl: 'https://lms.courses.dmu.edu.et/certificates/56f2cb3ca580485da3e9aafb3acb85b7',
    file: null,
  },
  {
    title: 'SSH Suite — Keeping Yourself Safe Online',
    issuer: 'DMU with MOE',
    date: 'November 2024',
    description: 'Cybersecurity fundamentals — identifying online threats, protecting personal data, and maintaining professional digital hygiene.',
    icon: '🔒',
    color: 'from-teal-600/20 to-cyan-600/10',
    border: 'border-teal-500/20',
    badge: 'SSH Suite',
    liveUrl: 'https://lms.courses.dmu.edu.et/certificates/0a31007922ec42a9846e8f5b89e62ef3',
    file: null,
  },
  {
    title: 'SSH Suite — Strategies for Successful Online Learning',
    issuer: 'DMU with MOE',
    date: 'November 2024',
    description: 'Digital competence and netiquette — professional communication in virtual teams and self-discipline for remote work environments.',
    icon: '🌐',
    color: 'from-teal-600/20 to-cyan-600/10',
    border: 'border-teal-500/20',
    badge: 'SSH Suite',
    liveUrl: 'https://lms.courses.dmu.edu.et/certificates/35cf8042986d4a67a757513dce855208',
    file: null,
  },
  {
    title: 'SSH Suite — Set Goals to Manage Your Time',
    issuer: 'DMU with MOE',
    date: 'November 2024',
    description: 'Productivity and time management — goal-setting frameworks to prioritize high-impact tasks and meet project deadlines.',
    icon: '🎯',
    color: 'from-teal-600/20 to-cyan-600/10',
    border: 'border-teal-500/20',
    badge: 'SSH Suite',
    liveUrl: 'https://lms.courses.dmu.edu.et/certificates/982737447a06479e93785f47d306a9fc',
    file: null,
  },
  {
    title: 'SSH Suite — How to Evaluate Resources',
    issuer: 'DMU with MOE',
    date: 'November 2024',
    description: 'Critical thinking skills to differentiate reliable from unreliable information — essential for research and evidence-based technical decisions.',
    icon: '🔍',
    color: 'from-teal-600/20 to-cyan-600/10',
    border: 'border-teal-500/20',
    badge: 'SSH Suite',
    liveUrl: 'https://lms.courses.dmu.edu.et/certificates/ed90fb5d946f4c42874e9efda89112bf',
    file: null,
  },
  {
    title: 'SSH Suite — Academic Integrity',
    issuer: 'DMU with MOE',
    date: 'November 2024',
    description: 'Ethical standards in education and work — proper referencing, avoiding plagiarism, and meeting international integrity standards.',
    icon: '🏅',
    color: 'from-teal-600/20 to-cyan-600/10',
    border: 'border-teal-500/20',
    badge: 'SSH Suite',
    liveUrl: 'https://lms.courses.dmu.edu.et/certificates/02466361a70f4e9f8a165b19cf91fdba',
    file: null,
  },
  {
    title: 'SSH Suite — How to Take a Course',
    issuer: 'DMU with MOE',
    date: 'November 2024',
    description: 'Comprehensive walkthrough of the LMS — navigating digital learning environments, interactive tools, and managing online coursework.',
    icon: '🎓',
    color: 'from-teal-600/20 to-cyan-600/10',
    border: 'border-teal-500/20',
    badge: 'SSH Suite',
    liveUrl: 'https://lms.courses.dmu.edu.et/certificates/f22b4242ed12497c92dd75ed441379b1',
    file: null,
  },
  // --- DMU Students Union ---
  {
    title: 'DMU Students Union',
    issuer: 'Debre Markos University',
    date: '2024',
    description: 'Leadership and community service certificate from the Debre Markos University Students Union.',
    icon: '🏛️',
    color: 'from-indigo-600/20 to-blue-600/10',
    border: 'border-indigo-500/20',
    badge: 'Leadership',
    liveUrl: null,
    file: '/downloads/dmu_union_cert.pdf',
  },
];

const BADGE_FILTERS = ['All', 'Data Science', 'AI / ML', 'Mobile Dev', 'Programming', 'Cybersecurity', 'SSH Suite', 'Leadership'];

function CertCard({ cert }: { cert: typeof CERTS[number] }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal card glow-on-hover bg-gradient-to-br ${cert.color} border ${cert.border} flex flex-col`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl flex-shrink-0">{cert.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="text-white font-semibold text-sm leading-snug">{cert.title}</h3>
            <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              {cert.badge}
            </span>
          </div>
          <p className="text-primary-400 text-xs font-medium">{cert.issuer}</p>
          <p className="text-gray-600 text-xs">{cert.date}</p>
        </div>
      </div>

      <p className="text-gray-400 text-xs leading-relaxed flex-grow mb-4">{cert.description}</p>

      <div className="flex gap-3 mt-auto">
        {cert.liveUrl && (
          <a
            href={cert.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Certificate
          </a>
        )}
        {cert.file && (
          <a
            href={cert.file}
            download
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
        )}
      </div>
    </div>
  );
}

export default function Certificates() {
  const titleRef = useReveal();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? CERTS
    : CERTS.filter((c) => c.badge === activeFilter);

  return (
    <section id="certificates" className="py-24 bg-dark-800/30">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={titleRef} className="reveal text-center mb-12">
          <p className="section-subtitle">// achievements</p>
          <h2 className="section-title">Certificates & CV</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full mx-auto mt-4" />
          <p className="text-gray-500 mt-3 text-sm">{CERTS.length} certificates across multiple domains</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {BADGE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-dark-600 border border-white/10 text-gray-400 hover:text-white hover:border-primary-500/30'
              }`}
            >
              {f}
              {f !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  {CERTS.filter((c) => c.badge === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filtered.map((cert) => (
            <CertCard key={cert.title} cert={cert} />
          ))}
        </div>

        {/* CV section */}
        <div className="card bg-gradient-to-br from-primary-600/10 to-blue-600/5 border-primary-500/20 text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-white font-bold text-xl mb-1">Curriculum Vitae</h3>
          <p className="text-gray-500 text-sm mb-2">BSc Software Engineering · CGPA 3.86 · Online Banking Technical Officer @ Enat Bank</p>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Full professional CV with work experience, education, projects, and skills.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://www.canva.com/design/DAGs2oZ685w/K_xVgJR2cBqwF32pHDof0g/edit?utm_content=DAGs2oZ685w&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              View CV Online
            </a>
            <a href="/downloads/Hailemariam_Eyayu_Resume.pdf" download className="btn-outline">
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useProfileContext } from '../context/ProfileContext';

export default function Footer({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const { profile } = useProfileContext();
  const year = new Date().getFullYear();

  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <footer className="border-t border-white/5 py-10 bg-dark-800/50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white text-xs">
            {initials}
          </div>
          <span className="text-gray-400 text-sm">
            © {year} <span className="text-white font-medium">{profile.full_name}</span>. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span>Built with</span>
          <span className="text-red-400">♥</span>
          <span>using React + Tailwind CSS</span>
        </div>

        <div className="flex gap-4">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors text-sm">
              GitHub
            </a>
          )}
          {profile.telegram && (
            <a href={profile.telegram} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors text-sm">
              Telegram
            </a>
          )}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            Back to top ↑
          </button>
          {/* Hidden admin trigger — small dot in footer */}
          <button
            onClick={onOpenAdmin}
            className="text-dark-800 hover:text-gray-700 transition-colors text-sm select-none"
            aria-label="Admin"
            title="Admin"
          >
            ·
          </button>
        </div>
      </div>
    </footer>
  );
}

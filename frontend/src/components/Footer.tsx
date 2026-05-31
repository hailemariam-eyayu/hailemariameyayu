export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-10 bg-dark-800/50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white text-xs">
            HE
          </div>
          <span className="text-gray-400 text-sm">
            © {year} <span className="text-white font-medium">Hailemariam Eyayu</span>. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span>Built with</span>
          <span className="text-red-400">♥</span>
          <span>using React + Tailwind CSS</span>
        </div>

        <div className="flex gap-4">
          <a
            href="https://github.com/hailemariam-eyayu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            GitHub
          </a>
          <a
            href="https://t.me/hailemariam_eyayu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            Telegram
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

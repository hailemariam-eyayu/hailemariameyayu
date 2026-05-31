import { useEffect, useRef, useState } from 'react';
import type { Stats } from '../types';

interface Props {
  stats: Stats | null;
}

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const STAT_ITEMS = [
  { key: 'years_experience', label: 'Years Experience', suffix: '+', icon: '⚡' },
  { key: 'technologies_count', label: 'Technologies', suffix: '+', icon: '🛠️' },
  { key: 'completed_projects', label: 'Projects Completed', suffix: '+', icon: '🚀' },
  { key: 'platforms', label: 'Platforms', suffix: '', icon: '📱' },
  { key: 'satisfied_clients', label: 'Satisfied Clients', suffix: '+', icon: '🤝' },
] as const;

export default function StatsBar({ stats }: Props) {
  return (
    <section className="py-12 border-y border-white/5 bg-dark-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {STAT_ITEMS.map((item) => {
            const value = stats ? parseInt(stats[item.key] || '0') : 0;
            return (
              <div key={item.key} className="text-center group">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                  <AnimatedNumber target={value} suffix={item.suffix} />
                </div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

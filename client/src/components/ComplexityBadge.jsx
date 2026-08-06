import React from 'react';
import { Zap, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ComplexityBadge({ type = 'time', complexity, rating, reason }) {
  if (!complexity) return null;

  // Determine color scheme based on complexity string
  let badgeColor = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  let badgeIcon = Zap;

  if (complexity.includes('log n') && !complexity.includes('n log n')) {
    badgeColor = 'border-teal-500/30 bg-teal-500/10 text-teal-400';
    badgeIcon = Zap;
  } else if (complexity === 'O(n)') {
    badgeColor = 'border-blue-500/30 bg-blue-500/10 text-blue-400';
    badgeIcon = Clock;
  } else if (complexity.includes('n log n')) {
    badgeColor = 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400';
    badgeIcon = Clock;
  } else if (complexity.includes('n^2')) {
    badgeColor = 'border-amber-500/30 bg-amber-500/10 text-amber-400';
    badgeIcon = AlertTriangle;
  } else if (complexity.includes('n^3') || complexity.includes('2^n') || complexity.includes('n!')) {
    badgeColor = 'border-rose-500/30 bg-rose-500/10 text-rose-400';
    badgeIcon = AlertTriangle;
  }

  const Icon = badgeIcon;

  return (
    <div className={`flex flex-col gap-1 p-3 rounded-xl border ${badgeColor} backdrop-blur-md transition-all hover:scale-[1.02]`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-wider font-semibold opacity-75">
          {type === 'time' ? 'Time Complexity' : 'Space Complexity'}
        </span>
        <Icon className="w-4 h-4 opacity-80" />
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold font-mono tracking-tight text-white dark:text-white light:text-slate-900">
          {complexity}
        </span>
        {rating && rating.level && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-200 dark:text-slate-200 light:text-slate-700">
            {rating.level}
          </span>
        )}
      </div>

      {reason && (
        <p className="text-xs opacity-85 leading-relaxed mt-0.5 line-clamp-2">
          {reason}
        </p>
      )}
    </div>
  );
}

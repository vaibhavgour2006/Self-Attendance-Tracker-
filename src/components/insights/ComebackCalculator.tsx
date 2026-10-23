import React from 'react';
import { Target, Zap, ShieldCheck } from 'lucide-react';
import { AttendanceStats, AppSettings } from '../../types';

interface ComebackCalculatorProps {
  stats: AttendanceStats;
  settings: AppSettings;
}

export const ComebackCalculator: React.FC<ComebackCalculatorProps> = ({ stats, settings }) => {
  const target = settings.attendanceTarget;
  const { attended, eligibleTotal, percentage } = stats;

  if (eligibleTotal === 0) return null;

  const isAbove = percentage >= target;

  // Needed: ceil((target * eligible - 100 * attended) / (100 - target))
  let neededClasses = 0;
  if (!isAbove && target < 100) {
    const raw = (target * eligibleTotal - 100 * attended) / (100 - target);
    neededClasses = Math.max(0, Math.ceil(raw));
  }

  // Can bunk: floor((100 * attended - target * eligible) / target)
  let safeBunks = 0;
  if (isAbove && target > 0) {
    const raw = (100 * attended - target * eligibleTotal) / target;
    safeBunks = Math.max(0, Math.floor(raw));
  }

  return (
    <div className="card-raised rounded-[28px] p-5 mb-5 border border-white/[0.08]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={15} className="text-[#7FE3C0]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A93]">
            Target Simulator ({target}%)
          </h3>
        </div>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isAbove
              ? 'bg-[#7FE3C0]/15 text-[#7FE3C0]'
              : 'bg-rose-500/15 text-rose-300'
          }`}
        >
          {isAbove ? 'Safe Zone' : 'Comeback Required'}
        </span>
      </div>

      {isAbove ? (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7FE3C0]/15 text-[#7FE3C0] flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F2F2F0]">
              You can safely bunk <strong className="text-[#7FE3C0] font-mono text-base">{safeBunks}</strong> class{safeBunks === 1 ? '' : 'es'}
            </p>
            <p className="text-xs text-[#8A8A93] mt-1 leading-relaxed">
              Your current attendance is {percentage}%. You have sufficient margin above the mandatory {target}% threshold.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/15 text-amber-300 flex items-center justify-center shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F2F2F0]">
              Attend next <strong className="text-amber-300 font-mono text-base">{neededClasses}</strong> consecutive classes
            </p>
            <p className="text-xs text-[#8A8A93] mt-1 leading-relaxed">
              Attending {neededClasses} consecutive classes without misses will bring your semester standing back to {target}%.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Minus, AlertTriangle } from 'lucide-react';
import { SubjectAttendanceStat } from '../../types';

interface SubjectRankingsProps {
  stats: SubjectAttendanceStat[];
  leastAttended?: SubjectAttendanceStat;
  mostAttended?: SubjectAttendanceStat;
  midAttended?: SubjectAttendanceStat;
  hasTies: boolean;
  targetAttendance: number;
}

export const SubjectRankings: React.FC<SubjectRankingsProps> = ({
  stats,
  leastAttended,
  mostAttended,
  midAttended,
  hasTies,
  targetAttendance,
}) => {
  // Gradual bar-filling animation on mount
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(false);
    const timeout = setTimeout(() => {
      setIsAnimated(true);
    }, 80);
    return () => clearTimeout(timeout);
  }, [stats]);

  return (
    <div className="space-y-5">
      {/* 3 Highlighted Cards: Least, Most, and Mid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Least Attended */}
        <div className="card-raised rounded-2xl p-3 flex flex-col justify-between border-rose-500/20 bg-rose-500/[0.03] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">
              <TrendingDown size={12} />
              <span>Lowest</span>
            </div>
            <p className="text-xs font-semibold text-[#F2F2F0] line-clamp-2 leading-tight">
              {leastAttended ? leastAttended.subject.name : '—'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04]">
            <span className="font-display text-xl text-rose-400 leading-none">
              {leastAttended ? `${leastAttended.percentage}%` : '—'}
            </span>
            <p className="text-[10px] text-[#8A8A93] font-mono mt-0.5">
              {leastAttended?.subject.courseCode}
            </p>
          </div>
        </div>

        {/* Median / Mid Attended */}
        <div className="card-raised rounded-2xl p-3 flex flex-col justify-between border-white/[0.06] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8A93] mb-1">
              <Minus size={12} />
              <span>Median</span>
            </div>
            <p className="text-xs font-semibold text-[#F2F2F0] line-clamp-2 leading-tight">
              {midAttended ? midAttended.subject.name : '—'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04]">
            <span className="font-display text-xl text-[#F2F2F0] leading-none">
              {midAttended ? `${midAttended.percentage}%` : '—'}
            </span>
            <p className="text-[10px] text-[#8A8A93] font-mono mt-0.5">
              {midAttended?.subject.courseCode}
            </p>
          </div>
        </div>

        {/* Most Attended */}
        <div className="card-raised rounded-2xl p-3 flex flex-col justify-between border-[#7FE3C0]/20 bg-[#7FE3C0]/[0.03] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7FE3C0] mb-1">
              <TrendingUp size={12} />
              <span>Highest</span>
            </div>
            <p className="text-xs font-semibold text-[#F2F2F0] line-clamp-2 leading-tight">
              {mostAttended ? mostAttended.subject.name : '—'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04]">
            <span className="font-display text-xl text-[#7FE3C0] leading-none">
              {mostAttended ? `${mostAttended.percentage}%` : '—'}
            </span>
            <p className="text-[10px] text-[#8A8A93] font-mono mt-0.5">
              {mostAttended?.subject.courseCode}
            </p>
          </div>
        </div>
      </div>

      {/* Tie notice if applicable */}
      {hasTies && (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-[#8A8A93]">
          <AlertTriangle size={12} className="text-amber-400 shrink-0" />
          <span>Tie detected: Multiple subjects share identical attendance percentages.</span>
        </div>
      )}

      {/* Full Subject-wise breakdown */}
      <div className="card-raised rounded-[28px] p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A93] mb-4">
          Course Breakdown & Status
        </h3>

        <div className="space-y-4">
          {stats.map((item, idx) => {
            const isSafe = item.percentage >= targetAttendance;

            return (
              <div key={item.subject.id} className="group">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="text-sm font-semibold text-[#F2F2F0] leading-tight">
                      {item.subject.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#8A8A93]">
                      {item.subject.courseCode} • {item.attended}/{item.eligible} attended
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`font-display text-lg leading-none ${
                        isSafe ? 'text-[#7FE3C0]' : 'text-amber-400'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                    <span className="block text-[10px] text-[#8A8A93] mt-0.5">
                      {isSafe
                        ? item.canBunkCount > 0
                          ? `Can bunk ${item.canBunkCount}`
                          : 'On target'
                        : `Need +${item.classesNeededForTarget}`}
                    </span>
                  </div>
                </div>

                {/* Animated Progress bar filling gradually from 0 */}
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isSafe ? 'bg-[#7FE3C0]' : 'bg-rose-400'
                    }`}
                    style={{
                      width: isAnimated ? `${Math.min(item.percentage, 100)}%` : '0%',
                      transitionDelay: `${idx * 60}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

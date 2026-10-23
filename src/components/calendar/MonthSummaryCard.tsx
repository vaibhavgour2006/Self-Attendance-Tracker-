import React from 'react';
import { AttendanceStats, AppSettings } from '../../types';

interface MonthSummaryCardProps {
  stats: AttendanceStats;
  settings: AppSettings;
  monthName: string;
}

export const MonthSummaryCard: React.FC<MonthSummaryCardProps> = ({
  stats,
  settings,
  monthName,
}) => {
  return (
    <div className="card-raised rounded-[28px] p-5 mb-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A93]">
          Monthly Analytics • {monthName}
        </span>
        <span className="text-[11px] text-[#7FE3C0] font-mono">
          Target {settings.attendanceTarget}%
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-4xl text-[#F2F2F0]">
          {stats.hasClasses ? `${stats.percentage}%` : '—'}
        </span>
        <span className="text-xs text-[#8A8A93]">
          {stats.hasClasses
            ? `${stats.attended} attended of ${stats.eligibleTotal} valid sessions`
            : 'No scheduled classes in this period'}
        </span>
      </div>

      {/* Breakdown Pills */}
      <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/[0.05]">
        <div className="card-inset rounded-xl p-2.5 text-center">
          <span className="block text-xs font-semibold text-[#7FE3C0]">
            {stats.attended}
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-[#8A8A93] mt-0.5">
            Attended
          </span>
        </div>

        <div className="card-inset rounded-xl p-2.5 text-center">
          <span className="block text-xs font-semibold text-rose-400">
            {stats.absent}
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-[#8A8A93] mt-0.5">
            Absent
          </span>
        </div>

        <div className="card-inset rounded-xl p-2.5 text-center">
          <span className="block text-xs font-semibold text-amber-300">
            {stats.gt}
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-[#8A8A93] mt-0.5 truncate">
            {settings.gtLabel}
          </span>
        </div>

        <div className="card-inset rounded-xl p-2.5 text-center">
          <span className="block text-xs font-semibold text-[#5A5A63]">
            {stats.cancelled}
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-[#8A8A93] mt-0.5">
            Cancelled
          </span>
        </div>
      </div>
    </div>
  );
};

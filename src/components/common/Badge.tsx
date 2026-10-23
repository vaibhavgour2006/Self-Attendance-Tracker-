import React from 'react';
import { AttendanceStatus, ClassLiveStatus, ClassType } from '../../types';

interface BadgeProps {
  type?: 'attendance' | 'live' | 'classType' | 'custom';
  status?: AttendanceStatus | ClassLiveStatus | ClassType | string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type = 'custom',
  status,
  label,
  size = 'sm',
  className = '',
}) => {
  const displayLabel = label || status || '';

  let colorClasses = 'bg-[#1A1A1F] text-[#8A8A93] border-white/[0.06]';

  if (type === 'attendance') {
    switch (status) {
      case 'attended':
        colorClasses = 'bg-[#7FE3C0]/10 text-[#7FE3C0] border-[#7FE3C0]/25';
        break;
      case 'absent':
        colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        break;
      case 'gt':
        colorClasses = 'bg-amber-400/10 text-amber-300 border-amber-400/25';
        break;
      case 'cancelled':
        colorClasses = 'bg-white/[0.04] text-[#5A5A63] border-white/[0.06] line-through';
        break;
    }
  } else if (type === 'live') {
    switch (status) {
      case 'ongoing':
        colorClasses = 'bg-[#7FE3C0]/15 text-[#7FE3C0] border-[#7FE3C0]/30 animate-pulse';
        break;
      case 'starting_soon':
        colorClasses = 'bg-amber-400/15 text-amber-300 border-amber-400/30';
        break;
      case 'upcoming':
        colorClasses = 'bg-white/[0.05] text-[#8A8A93] border-white/[0.08]';
        break;
      case 'ended':
        colorClasses = 'bg-white/[0.02] text-[#5A5A63] border-white/[0.04]';
        break;
    }
  } else if (type === 'classType') {
    switch (status) {
      case 'Practical / Lab':
        colorClasses = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
        break;
      case 'Workshop':
        colorClasses = 'bg-purple-500/10 text-purple-300 border-purple-500/20';
        break;
      case 'Tutorial':
        colorClasses = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
        break;
      case 'Seminar':
        colorClasses = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
        break;
      default:
        colorClasses = 'bg-white/[0.05] text-[#8A8A93] border-white/[0.07]';
        break;
    }
  }

  const sizeClasses =
    size === 'sm' ? 'text-[11px] px-2 py-0.5 tracking-wider' : 'text-xs px-2.5 py-1 tracking-wider';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border uppercase ${sizeClasses} ${colorClasses} ${className}`}
    >
      {type === 'live' && status === 'ongoing' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#7FE3C0] shrink-0" />
      )}
      {displayLabel}
    </span>
  );
};

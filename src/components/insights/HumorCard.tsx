import React from 'react';
import { Sparkles, Quote } from 'lucide-react';
import { FunnyMessage } from '../../types';
import { getFunnyAttendanceMessage } from '../../utils/attendance';

interface HumorCardProps {
  percentage: number;
  messages: FunnyMessage[];
}

export const HumorCard: React.FC<HumorCardProps> = ({ percentage, messages }) => {
  const quote = getFunnyAttendanceMessage(percentage, messages);

  return (
    <div className="card-raised rounded-[28px] p-5 mb-5 relative overflow-hidden border border-[#7FE3C0]/15 bg-gradient-to-br from-[#1A1A1F] via-[#16161B] to-[#121215]">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7FE3C0]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7FE3C0]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7FE3C0]">
            Attendance Mood • Reality Check
          </span>
        </div>
        <Quote size={16} className="text-[#5A5A63]" />
      </div>

      <p className="font-display text-2xl text-[#F2F2F0] leading-snug tracking-normal mt-1">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#8A8A93] pt-2.5 border-t border-white/[0.04]">
        <span>Current standing: <strong className="text-[#F2F2F0]">{percentage}%</strong></span>
        <span className="italic">Evaluated dynamically</span>
      </div>
    </div>
  );
};

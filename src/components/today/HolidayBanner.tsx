import React from 'react';
import { CalendarOff, Info } from 'lucide-react';
import { AcademicEvent } from '../../types';

interface HolidayBannerProps {
  event: AcademicEvent;
}

export const HolidayBanner: React.FC<HolidayBannerProps> = ({ event }) => {
  return (
    <div className="card-raised rounded-2xl p-4 mb-4 border border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-transparent">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-400/15 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
          <CalendarOff size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
              {event.eventType === 'vacation' ? 'Academic Vacation' : 'Holiday'}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-[#F2F2F0] mt-0.5">
            {event.name}
          </h4>
          <p className="text-xs text-[#8A8A93] mt-1">
            {event.notes || 'Classes suspended per IET DAVV academic schedule.'}
          </p>
        </div>
      </div>
    </div>
  );
};

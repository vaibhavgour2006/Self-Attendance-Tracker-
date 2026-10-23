import { Calendar as CalendarIcon, Settings, Sparkles, LogOut } from 'lucide-react';
import { AcademicEvent } from '../../types';

interface TodayHeaderProps {
  onOpenCalendar: () => void;
  onOpenSettings: () => void;
  onOpenCampusGuide: () => void;
  onLogout?: () => void;
  activeEvent?: AcademicEvent;
}

export const TodayHeader: React.FC<TodayHeaderProps> = ({
  onOpenCalendar,
  onOpenSettings,
  onOpenCampusGuide,
  onLogout,
  activeEvent,
}) => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="flex items-center justify-between py-4 px-2 select-none">
      {/* Left: Calendar toggle */}
      <button
        onClick={onOpenCalendar}
        className="w-10 h-10 rounded-2xl bg-[#1A1A1F] border border-white/[0.08] flex items-center justify-center text-[#8A8A93] hover:text-[#7FE3C0] hover:border-[#7FE3C0]/30 transition-all active:scale-95 shadow-sm"
        title="View Full Month Calendar"
        aria-label="View Full Month Calendar"
      >
        <CalendarIcon size={18} />
      </button>

      {/* Center: Current Date and Day */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-base font-semibold text-[#F2F2F0] tracking-tight">
          {dateStr}
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] font-medium tracking-wider uppercase text-[#8A8A93]">
            {dayName}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span
            className={`text-[11px] font-medium ${
              activeEvent
                ? 'text-amber-400'
                : 'text-[#7FE3C0]'
            }`}
          >
            {activeEvent ? activeEvent.name : 'Academic Day'}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenCampusGuide}
          className="w-9 h-9 rounded-2xl bg-[#1A1A1F] border border-white/[0.08] flex items-center justify-center text-[#7FE3C0] hover:border-[#7FE3C0]/40 transition-all active:scale-95 shadow-sm"
          title="Campus Map & Places"
          aria-label="Campus Map & Places"
        >
          <Sparkles size={16} />
        </button>
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-2xl bg-[#1A1A1F] border border-white/[0.08] flex items-center justify-center text-[#8A8A93] hover:text-[#F2F2F0] hover:border-white/20 transition-all active:scale-95 shadow-sm"
          title="Settings & Profile"
          aria-label="Settings & Profile"
        >
          <Settings size={16} />
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95 shadow-sm"
            title="Log Out Student"
            aria-label="Log Out Student"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </header>
  );
};

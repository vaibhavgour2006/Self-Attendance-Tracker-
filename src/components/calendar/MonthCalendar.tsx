import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import {
  AttendanceRecord,
  AcademicEvent,
  ScheduleEntry,
  StudentProfile,
  AppSettings,
  CampusLocation,
  Subject,
} from '../../types';
import {
  getLocalDateString,
  getAcademicEventForDate,
  calculateAttendanceStats,
} from '../../utils/attendance';

interface MonthCalendarProps {
  records: AttendanceRecord[];
  events: AcademicEvent[];
  schedule: ScheduleEntry[];
  subjects: Subject[];
  locations: CampusLocation[];
  profile: StudentProfile;
  settings: AppSettings;
  onSelectDate: (dateStr: string) => void;
  selectedDateStr: string;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  records,
  events,
  schedule,
  profile,
  settings,
  onSelectDate,
  selectedDateStr,
}) => {
  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthName = currentMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleReturnToday = () => {
    setCurrentMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(getLocalDateString(today));
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastDayOfMonth.getDate();

  // Day of week offset: 1 = Mon, 7 = Sun
  const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
  const leadingBlanks = startingDayOfWeek - 1;

  const todayStr = getLocalDateString(today);

  // Group records by classDate
  const recordsByDate = new Map<string, AttendanceRecord[]>();
  records.forEach((r) => {
    const list = recordsByDate.get(r.classDate) || [];
    list.push(r);
    recordsByDate.set(r.classDate, list);
  });

  return (
    <div className="card-raised rounded-[28px] p-5 select-none">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#F2F2F0] tracking-tight">
            {monthName}
          </h2>
          <p className="text-[11px] text-[#8A8A93]">
            Academic Attendance Grid
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleReturnToday}
            className="px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-[#7FE3C0] font-medium flex items-center gap-1 transition-colors mr-1"
            title="Jump to today"
          >
            <RotateCcw size={11} /> Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#8A8A93] hover:text-[#F2F2F0] transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#8A8A93] hover:text-[#F2F2F0] transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => (
          <span
            key={d}
            className={`text-[11px] font-medium uppercase tracking-wider ${
              i >= 5 ? 'text-[#5A5A63]' : 'text-[#8A8A93]'
            }`}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Leading empty tiles */}
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank_${i}`} className="aspect-square opacity-0" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const dayNumber = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
            dayNumber
          ).padStart(2, '0')}`;

          const isSelected = dateStr === selectedDateStr;
          const isToday = dateStr === todayStr;

          const dateObj = new Date(dateStr + 'T12:00:00');
          const dayOfWeek = dateObj.getDay() === 0 ? 7 : dateObj.getDay();
          const isWeekend = dayOfWeek >= 6;
          const isWorkingDay = settings.workingDays.includes(dayOfWeek);

          const event = getAcademicEventForDate(dateStr, events);
          const isHoliday = event && (event.eventType === 'holiday' || event.eventType === 'vacation');

          const dayRecords = recordsByDate.get(dateStr) || [];
          const stats = calculateAttendanceStats(dayRecords, settings);

          const hasAttended = stats.attended > 0;
          const hasAbsent = stats.absent > 0;
          const hasGt = stats.gt > 0;

          // Inside semester check
          const isWithinSemester =
            dateStr >= profile.semesterStartDate && dateStr <= profile.semesterEndDate;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`aspect-square relative rounded-2xl flex flex-col items-center justify-between p-1.5 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#7FE3C0] text-[#0A0A0C] font-bold shadow-[0_2px_12px_rgba(127,227,192,0.3)] scale-[1.04] z-10'
                  : isToday
                  ? 'border border-[#7FE3C0] bg-[#7FE3C0]/10 text-[#F2F2F0]'
                  : isHoliday
                  ? 'bg-amber-500/10 text-amber-200 border border-amber-500/15'
                  : isWeekend || !isWorkingDay
                  ? 'bg-white/[0.015] text-[#5A5A63]'
                  : 'bg-[#141418] hover:bg-[#1E1E24] text-[#F2F2F0] border border-white/[0.04]'
              }`}
            >
              {/* Day Number */}
              <span
                className={`text-xs ${
                  isSelected
                    ? 'text-[#0A0A0C] font-extrabold'
                    : isToday
                    ? 'text-[#7FE3C0] font-bold'
                    : isHoliday
                    ? 'text-amber-300'
                    : !isWithinSemester
                    ? 'text-[#5A5A63]'
                    : 'text-[#F2F2F0]'
                }`}
              >
                {dayNumber}
              </span>

              {/* Status Indicator Dots */}
              <div className="flex items-center gap-0.5 mt-auto">
                {isHoliday ? (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-[#0A0A0C]' : 'bg-amber-400'
                    }`}
                  />
                ) : dayRecords.length > 0 ? (
                  <>
                    {hasAttended && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-[#0A0A0C]' : 'bg-[#7FE3C0]'
                        }`}
                      />
                    )}
                    {hasAbsent && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-red-800' : 'bg-rose-400'
                        }`}
                      />
                    )}
                    {hasGt && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-amber-900' : 'bg-amber-400'
                        }`}
                      />
                    )}
                  </>
                ) : (
                  <span className="w-1 h-1 rounded-full opacity-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Subtle Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/[0.05] text-[11px] text-[#8A8A93]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7FE3C0]" /> Attended
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Absent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {settings.gtLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70" /> Holiday
        </span>
      </div>
    </div>
  );
};

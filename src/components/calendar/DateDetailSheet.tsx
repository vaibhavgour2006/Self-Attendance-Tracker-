import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import {
  AttendanceRecord,
  AcademicEvent,
  ScheduleEntry,
  StudentProfile,
  AppSettings,
  CampusLocation,
  Subject,
  ClassSessionItem,
} from '../../types';
import { BottomSheet } from '../common/BottomSheet';
import {
  getDayClassSessions,
  getAcademicEventForDate,
  calculateAttendanceStats,
} from '../../utils/attendance';
import { ClassCard } from '../today/ClassCard';
import { HolidayBanner } from '../today/HolidayBanner';

interface DateDetailSheetProps {
  dateStr: string;
  isOpen: boolean;
  onClose: () => void;
  records: AttendanceRecord[];
  events: AcademicEvent[];
  schedule: ScheduleEntry[];
  subjects: Subject[];
  locations: CampusLocation[];
  profile: StudentProfile;
  settings: AppSettings;
  onSelectSession: (session: ClassSessionItem) => void;
}

export const DateDetailSheet: React.FC<DateDetailSheetProps> = ({
  dateStr,
  isOpen,
  onClose,
  records,
  events,
  schedule,
  subjects,
  locations,
  profile,
  settings,
  onSelectSession,
}) => {
  if (!isOpen || !dateStr) return null;

  const dateObj = new Date(dateStr + 'T12:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const event = getAcademicEventForDate(dateStr, events);
  const sessions = getDayClassSessions(dateStr, schedule, subjects, locations, records, profile);

  const dayRecords = records.filter((r) => r.classDate === dateStr);
  const stats = calculateAttendanceStats(dayRecords, settings);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={formattedDate}
      subtitle="Class Timetable & Daily Attendance"
    >
      <div className="space-y-4">
        {/* Academic Holiday Banner if applicable */}
        {event && <HolidayBanner event={event} />}

        {/* Daily Stats Overview */}
        <div className="grid grid-cols-4 gap-2">
          <div className="card-inset rounded-xl p-2.5 text-center">
            <span className="block text-xs font-semibold text-[#7FE3C0]">
              {stats.attended}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-[#8A8A93]">
              Attended
            </span>
          </div>

          <div className="card-inset rounded-xl p-2.5 text-center">
            <span className="block text-xs font-semibold text-rose-400">
              {stats.absent}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-[#8A8A93]">
              Absent
            </span>
          </div>

          <div className="card-inset rounded-xl p-2.5 text-center">
            <span className="block text-xs font-semibold text-amber-300">
              {stats.gt}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-[#8A8A93] truncate">
              {settings.gtLabel}
            </span>
          </div>

          <div className="card-inset rounded-xl p-2.5 text-center">
            <span className="block text-xs font-semibold text-[#5A5A63]">
              {stats.cancelled}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-[#8A8A93]">
              Cancelled
            </span>
          </div>
        </div>

        {/* Timetable List */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A93] mb-2 px-1">
            Classes Scheduled ({sessions.length})
          </h4>

          {sessions.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
              <Calendar className="mx-auto mb-2 text-[#5A5A63]" size={24} />
              <p className="text-xs text-[#8A8A93]">
                No classes scheduled for this day.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <ClassCard
                  key={s.entry.id}
                  session={s}
                  onSelect={onSelectSession}
                  settings={settings}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};

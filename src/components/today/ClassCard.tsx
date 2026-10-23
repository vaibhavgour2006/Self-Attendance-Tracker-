import React from 'react';
import { MapPin, Clock, CheckCircle2, ChevronRight, Edit3 } from 'lucide-react';
import { ClassSessionItem, AppSettings } from '../../types';
import { Badge } from '../common/Badge';

interface ClassCardProps {
  session: ClassSessionItem;
  onSelect: (session: ClassSessionItem) => void;
  settings: AppSettings;
}

export const ClassCard: React.FC<ClassCardProps> = ({ session, onSelect, settings }) => {
  const { entry, subject, location, liveStatus, attendanceRecord } = session;

  const isRecorded = Boolean(attendanceRecord);
  const status = attendanceRecord?.status;

  const getStatusDisplayLabel = () => {
    if (!status) return null;
    if (status === 'gt') return settings.gtLabel;
    if (status === 'attended') return 'Attended';
    if (status === 'absent') return 'Absent';
    if (status === 'cancelled') return 'Cancelled';
    return status;
  };

  return (
    <div
      onClick={() => onSelect(session)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(session);
        }
      }}
      className="card-raised rounded-[24px] p-4.5 mb-3.5 transition-all duration-200 active:scale-[0.98] cursor-pointer hover:border-white/[0.14] group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        {/* Time and Live Status */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8A8A93]">
          <Clock size={13} className="text-[#5A5A63]" />
          <span>
            {entry.startTime} – {entry.endTime}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <Badge type="live" status={liveStatus} label={liveStatus.replace('_', ' ')} />
        </div>

        {/* Class Type Tag */}
        <Badge type="classType" status={entry.classType} />
      </div>

      {/* Course Title and Code */}
      <div className="mt-1">
        <h3 className="text-base font-semibold text-[#F2F2F0] tracking-tight group-hover:text-[#7FE3C0] transition-colors">
          {subject.name}
        </h3>
        <p className="text-xs text-[#8A8A93] font-mono mt-0.5">
          {subject.courseCode}
          {subject.instructor ? ` • ${subject.instructor}` : ''}
        </p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-[#8A8A93] mt-2.5">
        <MapPin size={13} className="text-[#7FE3C0] shrink-0" />
        <span className="truncate">{location.name} ({location.building})</span>
      </div>

      {/* Bottom Status / Action bar */}
      <div className="mt-3.5 pt-3 border-t border-white/[0.05] flex items-center justify-between">
        {isRecorded ? (
          <div className="flex items-center gap-2">
            <Badge
              type="attendance"
              status={status}
              label={getStatusDisplayLabel() || undefined}
            />
            {attendanceRecord?.isEdited && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-[#5A5A63]">
                <Edit3 size={10} /> Edited
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-[#7FE3C0] font-medium flex items-center gap-1">
            <CheckCircle2 size={13} />
            {liveStatus === 'ongoing' ? 'Mark Attendance Now' : 'Record Attendance'}
          </span>
        )}

        <div className="flex items-center gap-1 text-xs text-[#5A5A63] group-hover:text-[#F2F2F0] transition-colors">
          <span>{isRecorded ? 'Update' : 'Details'}</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  XCircle,
  Coffee,
  Ban,
  CalendarPlus,
  ListTodo,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ClassSessionItem, AttendanceStatus, AppSettings } from '../../types';
import { BottomSheet } from '../common/BottomSheet';
import { Badge } from '../common/Badge';
import { validateClassGeofence } from '../../utils/geofence';
import { createGoogleCalendarEvent, createGoogleTask, getAccessToken } from '../../services/googleWorkspace';

interface ClassDetailSheetProps {
  session: ClassSessionItem | null;
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onRecordAttendance: (
    status: AttendanceStatus,
    locationValidationState: 'verified_gps' | 'verified_demo' | 'failed' | 'not_required',
    distanceMeters?: number
  ) => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ClassDetailSheet: React.FC<ClassDetailSheetProps> = ({
  session,
  isOpen,
  onClose,
  settings,
  onRecordAttendance,
  onUpdateSettings,
  onShowToast,
}) => {
  const [isValidatingLocation, setIsValidatingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lastCheckResult, setLastCheckResult] = useState<{
    isInside: boolean;
    distanceMeters: number;
    mode: 'demo' | 'gps';
    message: string;
  } | null>(null);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [isSyncingTask, setIsSyncingTask] = useState(false);

  if (!session) return null;

  const { entry, subject, location, liveStatus, attendanceRecord, dateStr } = session;

  const handleMarkAttended = async () => {
    setIsValidatingLocation(true);
    setLocationError(null);

    try {
      const res = await validateClassGeofence(location, settings);
      setLastCheckResult(res);

      if (res.isInside) {
        onRecordAttendance(
          'attended',
          res.mode === 'demo' ? 'verified_demo' : 'verified_gps',
          res.distanceMeters
        );
        onShowToast(res.message, 'success');
        onClose();
      } else {
        setLocationError(res.message);
        onShowToast(res.message, 'error');
      }
    } catch (err: any) {
      setLocationError(err.message || 'Location validation failed');
      onShowToast(err.message || 'Location validation failed', 'error');
    } finally {
      setIsValidatingLocation(false);
    }
  };

  const handleMarkOther = (status: AttendanceStatus) => {
    onRecordAttendance(status, 'not_required');
    const label =
      status === 'absent'
        ? 'Marked as Absent'
        : status === 'gt'
        ? `Marked as ${settings.gtLabel}`
        : 'Marked as Cancelled';
    onShowToast(label, 'info');
    onClose();
  };

  const handleToggleDemoLocation = () => {
    const nextStatus: 'inside' | 'outside' =
      settings.simulatedLocationStatus === 'inside' ? 'outside' : 'inside';
    const updated = { ...settings, simulatedLocationStatus: nextStatus };
    onUpdateSettings(updated);
    setLastCheckResult(null);
    setLocationError(null);
    onShowToast(`Demo GPS simulated: ${nextStatus === 'inside' ? 'Inside Classroom' : 'Outside Campus'}`, 'info');
  };

  const handleSyncToGoogleCalendar = async () => {
    const token = await getAccessToken();
    if (!token) {
      onShowToast('Please sign in with Google in Profile first.', 'error');
      return;
    }

    setIsSyncingCalendar(true);
    const res = await createGoogleCalendarEvent(entry, subject, location, dateStr);
    setIsSyncingCalendar(false);

    if (res.success) {
      onShowToast(`Synced "${subject.name}" to Google Calendar!`, 'success');
    } else {
      onShowToast(res.error || 'Failed to sync calendar event', 'error');
    }
  };

  const handleCreateGoogleTask = async () => {
    const token = await getAccessToken();
    if (!token) {
      onShowToast('Please sign in with Google in Profile first.', 'error');
      return;
    }

    setIsSyncingTask(true);
    const title = `Study & Review: ${subject.name} (${subject.courseCode})`;
    const notes = `RollCall IET DAVV Reminder: Prepare notes and review lecture material for ${subject.name} [Room: ${location.room}].`;
    const res = await createGoogleTask(title, notes, dateStr);
    setIsSyncingTask(false);

    if (res.success) {
      onShowToast('Created assignment task in Google Tasks!', 'success');
    } else {
      onShowToast(res.error || 'Failed to create task', 'error');
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={subject.name}
      subtitle={`${subject.courseCode} • ${entry.classType}`}
    >
      <div className="space-y-4">
        {/* Class Metadata Card */}
        <div className="card-inset rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8A8A93] flex items-center gap-1.5">
              <Clock size={13} className="text-[#7FE3C0]" /> Time Schedule
            </span>
            <span className="font-semibold text-[#F2F2F0]">
              {entry.startTime} – {entry.endTime}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8A8A93] flex items-center gap-1.5">
              <MapPin size={13} className="text-[#7FE3C0]" /> Location
            </span>
            <span className="font-medium text-[#F2F2F0] text-right truncate max-w-[200px]">
              {location.name} ({location.room})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8A8A93]">Building</span>
            <span className="text-[#8A8A93]">{location.building}</span>
          </div>

          {subject.instructor && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8A8A93]">Faculty</span>
              <span className="text-[#F2F2F0]">{subject.instructor}</span>
            </div>
          )}

          {entry.notes && (
            <p className="text-[11px] text-[#8A8A93] italic pt-1 border-t border-white/[0.04]">
              &ldquo;{entry.notes}&rdquo;
            </p>
          )}
        </div>

        {/* Current Attendance State */}
        {attendanceRecord && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8A93]">Recorded Status:</span>
              <Badge
                type="attendance"
                status={attendanceRecord.status}
                label={
                  attendanceRecord.status === 'gt'
                    ? settings.gtLabel
                    : attendanceRecord.status
                }
              />
            </div>
            {attendanceRecord.isEdited && (
              <span className="text-[10px] text-[#5A5A63]">Manually Edited</span>
            )}
          </div>
        )}

        {/* Geofence & Demo Simulator Box */}
        <div className="p-3.5 rounded-2xl bg-[#1A1A1F] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-[#7FE3C0]" />
              <span className="text-xs font-semibold text-[#F2F2F0]">
                Geofence Verification
              </span>
            </div>
            <span className="text-[11px] text-[#8A8A93] font-mono">
              Radius: {location.geofenceRadiusMeters}m
            </span>
          </div>

          {settings.demoLocationMode && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] text-xs">
              <div className="flex items-center gap-1.5 text-[#8A8A93]">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Simulated Mode:</span>
                <span className="font-semibold text-[#F2F2F0]">
                  {settings.simulatedLocationStatus === 'inside'
                    ? 'Inside (~15m)'
                    : 'Outside (~220m)'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleDemoLocation}
                className="text-[11px] text-[#7FE3C0] font-medium hover:underline flex items-center gap-1"
              >
                <RefreshCw size={11} /> Switch
              </button>
            </div>
          )}

          {lastCheckResult && (
            <div
              className={`p-2 rounded-xl text-xs flex items-start gap-2 ${
                lastCheckResult.isInside
                  ? 'bg-[#7FE3C0]/10 text-[#7FE3C0] border border-[#7FE3C0]/20'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
              }`}
            >
              {lastCheckResult.isInside ? (
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
              )}
              <span>{lastCheckResult.message}</span>
            </div>
          )}

          {locationError && !lastCheckResult && (
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs flex items-start gap-1.5">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{locationError}</span>
            </div>
          )}
        </div>

        {/* 4 Attendance Action Buttons */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-2 px-1">
            {attendanceRecord ? 'Change Attendance Record' : 'Record Attendance'}
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Attended (requires geofence) */}
            <button
              onClick={handleMarkAttended}
              disabled={isValidatingLocation}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#7FE3C0] text-[#0A0A0C] font-semibold text-xs hover:bg-[#6edbb6] active:scale-[0.97] transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isValidatingLocation ? (
                <span className="w-3.5 h-3.5 border-2 border-[#0A0A0C] border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 size={15} />
              )}
              <span>Attended</span>
            </button>

            {/* 2. Absent */}
            <button
              onClick={() => handleMarkOther('absent')}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#1A1A1F] hover:bg-rose-500/15 hover:border-rose-500/30 border border-white/[0.08] text-rose-400 font-medium text-xs active:scale-[0.97] transition-all cursor-pointer"
            >
              <XCircle size={15} />
              <span>Absent</span>
            </button>

            {/* 3. GT 😛 */}
            <button
              onClick={() => handleMarkOther('gt')}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#1A1A1F] hover:bg-amber-400/15 hover:border-amber-400/30 border border-white/[0.08] text-amber-300 font-medium text-xs active:scale-[0.97] transition-all cursor-pointer"
            >
              <Coffee size={15} />
              <span>{settings.gtLabel}</span>
            </button>

            {/* 4. Cancelled */}
            <button
              onClick={() => handleMarkOther('cancelled')}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#1A1A1F] hover:bg-white/[0.08] border border-white/[0.08] text-[#8A8A93] font-medium text-xs active:scale-[0.97] transition-all cursor-pointer"
            >
              <Ban size={15} />
              <span>Cancelled</span>
            </button>
          </div>
        </div>

        {/* Google Workspace Integrations */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
          <button
            onClick={handleSyncToGoogleCalendar}
            disabled={isSyncingCalendar}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] font-medium text-[#F2F2F0] active:scale-[0.98] transition-all"
          >
            <CalendarPlus size={13} className="text-[#7FE3C0]" />
            <span>{isSyncingCalendar ? 'Syncing...' : 'Add to Calendar'}</span>
          </button>

          <button
            onClick={handleCreateGoogleTask}
            disabled={isSyncingTask}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] font-medium text-[#F2F2F0] active:scale-[0.98] transition-all"
          >
            <ListTodo size={13} className="text-[#7FE3C0]" />
            <span>{isSyncingTask ? 'Creating...' : 'Add Study Task'}</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

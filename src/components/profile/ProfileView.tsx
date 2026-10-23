import React, { useState } from 'react';
import {
  User,
  Settings,
  GraduationCap,
  Calendar,
  Compass,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Edit2,
  Share2,
  LogOut,
} from 'lucide-react';
import { StudentProfile, AppSettings } from '../../types';
import { GoogleSignInButton } from '../common/GoogleSignInButton';
import { User as FirebaseUser } from 'firebase/auth';
import { Button } from '../common/Button';

interface ProfileViewProps {
  profile: StudentProfile;
  settings: AppSettings;
  onUpdateProfile: (updated: StudentProfile) => void;
  onUpdateSettings: (updated: AppSettings) => void;
  onOpenEditProfile: () => void;
  onOpenApkGuide: () => void;
  onOpenCampusGuide: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
  onLogout: () => void;
  googleUser: FirebaseUser | null;
  isGoogleLoading: boolean;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  settings,
  onUpdateSettings,
  onOpenEditProfile,
  onOpenApkGuide,
  onOpenCampusGuide,
  onExportData,
  onImportData,
  onResetDemoData,
  onClearAllData,
  onLogout,
  googleUser,
  isGoogleLoading,
  onGoogleSignIn,
  onGoogleSignOut,
  onShowToast,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="space-y-5 pb-24">
      {/* Student Profile Card */}
      <div className="card-raised rounded-[28px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#7FE3C0]/15 text-[#7FE3C0] flex items-center justify-center font-bold text-base border border-[#7FE3C0]/25">
              {profile.name[0] || 'S'}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#F2F2F0]">
                {profile.name}
              </h2>
              <p className="text-xs text-[#7FE3C0] font-mono mt-0.5">
                {profile.rollNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenEditProfile}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8A93] hover:text-[#F2F2F0] transition-colors"
              title="Edit Profile"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors flex items-center gap-1 text-xs"
              title="Log Out Student"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-white/[0.05] text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#8A8A93]">Branch</span>
            <span className="text-[#F2F2F0] font-medium text-right truncate max-w-[220px]">
              {profile.branch}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8A8A93]">Semester</span>
            <span className="text-[#F2F2F0] font-medium">Semester {profile.semester}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8A8A93]">Semester Period</span>
            <span className="text-[#8A8A93] font-mono text-[11px]">
              {profile.semesterStartDate} to {profile.semesterEndDate}
            </span>
          </div>

          {profile.collegeEmail && (
            <div className="flex items-center justify-between">
              <span className="text-[#8A8A93]">Email</span>
              <span className="text-[#8A8A93] font-mono text-[11px] truncate max-w-[200px]">
                {profile.collegeEmail}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Google Workspace Integration */}
      <div className="card-raised rounded-[28px] p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A93]">
            Google Workspace Sync
          </h3>
        </div>
        <p className="text-xs text-[#8A8A93] mb-4">
          Connect your Google account to sync IET DAVV timetable sessions to Google Calendar and assignments to Google Tasks.
        </p>

        <GoogleSignInButton
          user={googleUser}
          isLoading={isGoogleLoading}
          onSignIn={onGoogleSignIn}
          onSignOut={onGoogleSignOut}
        />
      </div>

      {/* Tracker & Calculation Settings */}
      <div className="card-raised rounded-[28px] p-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A93]">
          Attendance Rules & GT Status
        </h3>

        {/* Target Attendance */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#F2F2F0]">Target Attendance</span>
            <span className="text-[#7FE3C0] font-bold font-mono">
              {settings.attendanceTarget}%
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="90"
            step="5"
            value={settings.attendanceTarget}
            onChange={(e) =>
              onUpdateSettings({ ...settings, attendanceTarget: Number(e.target.value) })
            }
            className="w-full accent-[#7FE3C0] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#5A5A63] mt-1">
            <span>60%</span>
            <span>75% (Standard)</span>
            <span>90%</span>
          </div>
        </div>

        {/* GT Label & Treatment */}
        <div className="pt-2 border-t border-white/[0.04] space-y-3">
          <div>
            <label className="block text-xs text-[#F2F2F0] mb-1">
              Bunk Status Label
            </label>
            <input
              type="text"
              value={settings.gtLabel}
              onChange={(e) =>
                onUpdateSettings({ ...settings, gtLabel: e.target.value || 'GT 😛' })
              }
              className="w-full px-3 py-2 rounded-xl bg-[#131316] border border-white/[0.08] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#7FE3C0]/50"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[#F2F2F0] block">Count {settings.gtLabel} as Attended?</span>
              <span className="text-[11px] text-[#8A8A93]">
                Default is false (remains in denominator as missed)
              </span>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  gtCountsAsAttended: !settings.gtCountsAsAttended,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.gtCountsAsAttended ? 'bg-[#7FE3C0]' : 'bg-white/10'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-[#0A0A0C] absolute top-0.5 transition-transform ${
                  settings.gtCountsAsAttended ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Geofence & Demo GPS Settings */}
      <div className="card-raised rounded-[28px] p-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A93]">
          Location Validation & Geofencing
        </h3>

        {/* Geofence Enabled Toggle */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-[#F2F2F0] block">Enforce Geofence on Attended</span>
            <span className="text-[11px] text-[#8A8A93]">
              Requires physical or simulated proximity
            </span>
          </div>
          <button
            onClick={() =>
              onUpdateSettings({
                ...settings,
                geofenceEnabled: !settings.geofenceEnabled,
              })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              settings.geofenceEnabled ? 'bg-[#7FE3C0]' : 'bg-white/10'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-[#0A0A0C] absolute top-0.5 transition-transform ${
                settings.geofenceEnabled ? 'left-5.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Radius */}
        <div className="pt-2 border-t border-white/[0.04]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#F2F2F0]">Class Geofence Radius</span>
            <span className="text-[#7FE3C0] font-bold font-mono">
              {settings.geofenceRadius}m
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="160"
            step="10"
            value={settings.geofenceRadius}
            onChange={(e) =>
              onUpdateSettings({ ...settings, geofenceRadius: Number(e.target.value) })
            }
            className="w-full accent-[#7FE3C0] cursor-pointer"
          />
        </div>

        {/* Demo Location Switcher */}
        <div className="pt-2 border-t border-white/[0.04] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[#F2F2F0] block">Demo Location Mode</span>
              <span className="text-[11px] text-amber-400">
                Allows instant testing inside browser preview
              </span>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  demoLocationMode: !settings.demoLocationMode,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.demoLocationMode ? 'bg-amber-400' : 'bg-white/10'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-[#0A0A0C] absolute top-0.5 transition-transform ${
                  settings.demoLocationMode ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {settings.demoLocationMode && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() =>
                  onUpdateSettings({ ...settings, simulatedLocationStatus: 'inside' })
                }
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  settings.simulatedLocationStatus === 'inside'
                    ? 'bg-[#7FE3C0] text-[#0A0A0C]'
                    : 'bg-white/[0.04] text-[#8A8A93] hover:text-[#F2F2F0]'
                }`}
              >
                Simulate Inside Class
              </button>
              <button
                onClick={() =>
                  onUpdateSettings({ ...settings, simulatedLocationStatus: 'outside' })
                }
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  settings.simulatedLocationStatus === 'outside'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/[0.04] text-[#8A8A93] hover:text-[#F2F2F0]'
                }`}
              >
                Simulate Outside Class
              </button>
            </div>
          )}
        </div>
      </div>

      {/* APK & Campus Tools */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onOpenApkGuide}
          className="card-raised rounded-2xl p-4 text-left hover:border-white/[0.14] transition-all group cursor-pointer"
        >
          <Smartphone size={20} className="text-[#7FE3C0] mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-semibold text-[#F2F2F0]">Android APK Build</h4>
          <p className="text-[11px] text-[#8A8A93] mt-0.5">Capacitor packaging steps</p>
        </button>

        <button
          onClick={onOpenCampusGuide}
          className="card-raised rounded-2xl p-4 text-left hover:border-white/[0.14] transition-all group cursor-pointer"
        >
          <Sparkles size={20} className="text-[#7FE3C0] mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-semibold text-[#F2F2F0]">Campus Explorer</h4>
          <p className="text-[11px] text-[#8A8A93] mt-0.5">Maps grounding guide</p>
        </button>
      </div>

      {/* Data Management */}
      <div className="card-raised rounded-[28px] p-5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A93]">
          Local Data & Backup
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onExportData}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#F2F2F0] transition-colors"
          >
            <Download size={14} className="text-[#7FE3C0]" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={onImportData}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#F2F2F0] transition-colors"
          >
            <Upload size={14} className="text-[#7FE3C0]" />
            <span>Import Backup</span>
          </button>
        </div>

        <div className="pt-2 border-t border-white/[0.04] space-y-2">
          {showResetConfirm ? (
            <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-xs space-y-2">
              <p className="text-amber-200">Reset attendance records to initial demo schedule?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onResetDemoData();
                    setShowResetConfirm(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 text-[#0A0A0C] font-semibold text-xs"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-[#F2F2F0] text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] text-xs font-medium text-[#8A8A93] hover:text-[#F2F2F0] transition-colors"
            >
              <RefreshCw size={13} />
              <span>Reset to Sample Attendance</span>
            </button>
          )}

          {showClearConfirm ? (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-2">
              <p className="text-rose-300">Are you sure? This will delete all attendance entries permanently.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClearAllData();
                    setShowClearConfirm(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-semibold text-xs"
                >
                  Confirm Delete All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-[#F2F2F0] text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-rose-500/5 hover:bg-rose-500/15 text-xs font-medium text-rose-400 transition-colors"
            >
              <Trash2 size={13} />
              <span>Clear All Personal Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Session & Showcase Card */}
      <div className="card-raised rounded-[28px] p-5 border border-white/[0.08] flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-[#F2F2F0]">Student Session</h4>
          <p className="text-[11px] text-[#8A8A93] mt-0.5">
            Log out to showcase the initial student login & onboarding portal.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <LogOut size={14} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

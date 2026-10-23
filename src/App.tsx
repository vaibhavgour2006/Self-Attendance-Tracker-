import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StudentProfile,
  Subject,
  CampusLocation,
  ScheduleEntry,
  AttendanceRecord,
  AcademicEvent,
  AppSettings,
  FunnyMessage,
  ClassSessionItem,
  AttendanceStatus,
} from './types';
import { StorageService } from './utils/storage';
import {
  getDayClassSessions,
  calculateSemesterStats,
  calculateMonthStats,
  calculateSubjectRankings,
  getLocalDateString,
  getAcademicEventForDate,
} from './utils/attendance';
import { TabBar, TabKey } from './components/common/TabBar';
import { TodayHeader } from './components/today/TodayHeader';
import { HolidayBanner } from './components/today/HolidayBanner';
import { ClassCard } from './components/today/ClassCard';
import { ClassDetailSheet } from './components/today/ClassDetailSheet';
import { AttendanceRing } from './components/common/AttendanceRing';
import { MonthCalendar } from './components/calendar/MonthCalendar';
import { MonthSummaryCard } from './components/calendar/MonthSummaryCard';
import { DateDetailSheet } from './components/calendar/DateDetailSheet';
import { HumorCard } from './components/insights/HumorCard';
import { SubjectRankings } from './components/insights/SubjectRankings';
import { ComebackCalculator } from './components/insights/ComebackCalculator';
import { ProfileView } from './components/profile/ProfileView';
import { OnboardingModal } from './components/profile/OnboardingModal';
import { CampusExplorerSheet } from './components/profile/CampusExplorerSheet';
import { ApkGuideModal } from './components/profile/ApkGuideModal';
import { StudentLoginPage } from './components/auth/StudentLoginPage';
import { initAuth, googleSignIn, googleSignOut } from './services/googleWorkspace';
import { User as FirebaseUser } from 'firebase/auth';
import { Smartphone, Monitor, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Ensure seed data is initialized on first load
  useEffect(() => {
    StorageService.initialize();
  }, []);

  // Application State
  const [activeTab, setActiveTab] = useState<TabKey>('today');
  const [profile, setProfile] = useState<StudentProfile>(StorageService.getProfile());
  const [subjects, setSubjects] = useState<Subject[]>(StorageService.getSubjects());
  const [locations, setLocations] = useState<CampusLocation[]>(StorageService.getLocations());
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(StorageService.getSchedule());
  const [records, setRecords] = useState<AttendanceRecord[]>(StorageService.getRecords());
  const [events, setEvents] = useState<AcademicEvent[]>(StorageService.getEvents());
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [funnyMessages, setFunnyMessages] = useState<FunnyMessage[]>(
    StorageService.getFunnyMessages()
  );

  // Student Authentication / Showcase State
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Modals & Sheets State
  const [selectedSession, setSelectedSession] = useState<ClassSessionItem | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(getLocalDateString());
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCampusGuideOpen, setIsCampusGuideOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);

  // Frame Display Toggle (Mobile frame preview vs full width)
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Toast feedback state
  const [toast, setToast] = useState<{
    msg: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast((prev) => (prev?.msg === msg ? null : prev));
    }, 3200);
  };

  // Google Auth State
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setGoogleUser(user);
      },
      () => {
        setGoogleUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setGoogleUser(res.user);
        showToast(`Signed in as ${res.user.displayName || res.user.email}!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Google Sign-in was cancelled or failed.', 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await googleSignOut();
    setGoogleUser(null);
    showToast('Signed out of Google account.', 'info');
  };

  // Automatic real-time clock tick for class live states
  const [currentTick, setCurrentTick] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTick(Date.now());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = useMemo(() => getLocalDateString(), [currentTick]);

  // Today's classes
  const todaySessions = useMemo(() => {
    return getDayClassSessions(todayStr, schedule, subjects, locations, records, profile);
  }, [todayStr, schedule, subjects, locations, records, profile, currentTick]);

  // Active academic holiday for today
  const todayHoliday = useMemo(() => {
    return getAcademicEventForDate(todayStr, events);
  }, [todayStr, events]);

  // Overall semester stats
  const semesterStats = useMemo(() => {
    return calculateSemesterStats(records, profile, settings, todayStr);
  }, [records, profile, settings, todayStr]);

  // Monthly stats for current month
  const todayDateObj = new Date();
  const currentMonthStats = useMemo(() => {
    return calculateMonthStats(
      todayDateObj.getFullYear(),
      todayDateObj.getMonth() + 1,
      records,
      profile,
      settings
    );
  }, [records, profile, settings, todayDateObj.getFullYear(), todayDateObj.getMonth()]);

  // Subject-wise rankings
  const subjectRankings = useMemo(() => {
    return calculateSubjectRankings(subjects, schedule, records, settings, profile);
  }, [subjects, schedule, records, settings, profile]);

  // Attendance recording handler
  const handleRecordAttendance = (
    status: AttendanceStatus,
    locationValidationState: 'verified_gps' | 'verified_demo' | 'failed' | 'not_required',
    distanceMeters?: number
  ) => {
    if (!selectedSession) return;

    const newRecord: AttendanceRecord = {
      id: selectedSession.attendanceRecord?.id || `rec_${selectedSession.dateStr}_${selectedSession.entry.id}`,
      scheduleEntryId: selectedSession.entry.id,
      classDate: selectedSession.dateStr,
      status,
      markedAt: new Date().toISOString(),
      locationValidationState,
      isEdited: Boolean(selectedSession.attendanceRecord),
      distanceMeters,
    };

    StorageService.saveRecord(newRecord);
    setRecords(StorageService.getRecords());

    // Update active session in sheet
    setSelectedSession((prev) =>
      prev ? { ...prev, attendanceRecord: newRecord } : null
    );
  };

  // Profile save
  const handleSaveProfile = (newProfile: StudentProfile) => {
    StorageService.saveProfile(newProfile);
    setProfile(newProfile);
    setIsOnboardingOpen(false);
    showToast('Student profile updated successfully!', 'success');
  };

  // Student Session Login & Logout
  const handleStudentLogin = (newProfile: StudentProfile) => {
    StorageService.saveProfile(newProfile);
    setProfile(newProfile);
    setIsLoggedIn(true);
    showToast(`Welcome, ${newProfile.name}! Dashboard loaded.`, 'success');
  };

  const handleStudentLogout = () => {
    setIsLoggedIn(false);
    showToast('Logged out! You can now showcase the student login portal.', 'info');
  };

  // Settings save
  const handleUpdateSettings = (newSettings: AppSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Backup & Restore
  const handleExportData = () => {
    const json = StorageService.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RollCall_Backup_${profile.rollNumber}_${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported RollCall backup JSON file!', 'success');
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importAllData(content);
      if (res.success) {
        setProfile(StorageService.getProfile());
        setSubjects(StorageService.getSubjects());
        setLocations(StorageService.getLocations());
        setSchedule(StorageService.getSchedule());
        setRecords(StorageService.getRecords());
        setEvents(StorageService.getEvents());
        setSettings(StorageService.getSettings());
        showToast('Restored attendance and profile from backup!', 'success');
      } else {
        showToast(res.error || 'Failed to parse backup JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDemoData = () => {
    StorageService.resetDemoData();
    setProfile(StorageService.getProfile());
    setSubjects(StorageService.getSubjects());
    setLocations(StorageService.getLocations());
    setSchedule(StorageService.getSchedule());
    setRecords(StorageService.getRecords());
    setEvents(StorageService.getEvents());
    setSettings(StorageService.getSettings());
    showToast('Reset sample timetable & attendance history!', 'success');
  };

  const handleClearAllData = () => {
    StorageService.clearAllData();
    setRecords([]);
    showToast('Cleared all attendance records.', 'info');
  };

  const handleCalendarDateSelect = (dStr: string) => {
    setSelectedCalendarDate(dStr);
    setIsDateSheetOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-[#F2F2F0] flex flex-col items-center justify-center">
        <StudentLoginPage
          onLogin={handleStudentLogin}
          currentProfile={profile}
        />
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A1A1F] border border-white/[0.12] text-xs font-medium text-[#F2F2F0] shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {toast.type === 'success' ? (
              <CheckCircle2 size={15} className="text-[#7FE3C0] shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle size={15} className="text-rose-400 shrink-0" />
            ) : (
              <Info size={15} className="text-[#7FE3C0] shrink-0" />
            )}
            <span>{toast.msg}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F2F2F0] flex flex-col items-center justify-start antialiased">
      {/* Hidden file input for backup restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Desktop Frame Mode Switcher */}
      <aside aria-label="Device view options" className="hidden md:flex items-center justify-between w-full max-w-4xl px-4 py-2.5 text-xs text-[#8A8A93] border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7FE3C0]" />
          <span className="font-semibold text-[#F2F2F0]">RollCall</span>
          <span className="text-[#5A5A63]">|</span>
          <span>IET DAVV Indore Personal Attendance Tracker</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-colors cursor-pointer ${
              isPhoneFrame
                ? 'bg-[#1A1A1F] text-[#7FE3C0] border border-[#7FE3C0]/20'
                : 'hover:text-[#F2F2F0]'
            }`}
          >
            <Smartphone size={13} />
            <span>390px Mobile View</span>
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-colors cursor-pointer ${
              !isPhoneFrame
                ? 'bg-[#1A1A1F] text-[#7FE3C0] border border-[#7FE3C0]/20'
                : 'hover:text-[#F2F2F0]'
            }`}
          >
            <Monitor size={13} />
            <span>Expanded View</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main
        className={`w-full transition-all duration-300 relative flex flex-col min-h-screen ${
          isPhoneFrame
            ? 'max-w-[390px] md:my-5 md:border md:border-white/[0.08] md:rounded-[44px] md:shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden bg-[#0A0A0C]'
            : 'max-w-xl px-4'
        }`}
      >
        {/* Top Header */}
        <div className="px-3 pt-2">
          <TodayHeader
            onOpenCalendar={() => setActiveTab('calendar')}
            onOpenSettings={() => setActiveTab('profile')}
            onOpenCampusGuide={() => setIsCampusGuideOpen(true)}
            onLogout={handleStudentLogout}
            activeEvent={todayHoliday}
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 px-4 pt-1 pb-28 overflow-y-auto no-scrollbar">
          {/* TAB 1: TODAY */}
          {activeTab === 'today' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Academic Holiday Banner if applicable */}
              {todayHoliday && <HolidayBanner event={todayHoliday} />}

              {/* Visually Dominant Attendance Hero */}
              <div className="card-raised rounded-[32px] p-4.5 my-2">
                <AttendanceRing
                  percentage={semesterStats.percentage}
                  attended={semesterStats.attended}
                  eligibleTotal={semesterStats.eligibleTotal}
                  target={settings.attendanceTarget}
                />
              </div>

              {/* Today's Timetable Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A93]">
                    Today&apos;s Classes ({todaySessions.length})
                  </h2>
                  <span className="text-[11px] text-[#5A5A63] font-mono">
                    {profile.branch.split(' ')[0]} • Sem {profile.semester}
                  </span>
                </div>

                {todaySessions.length === 0 ? (
                  <div className="card-raised rounded-[28px] p-8 text-center border-dashed border-white/[0.08]">
                    <p className="text-sm font-semibold text-[#F2F2F0]">
                      No classes scheduled for today
                    </p>
                    <p className="text-xs text-[#8A8A93] mt-1">
                      Enjoy your day or catch up on study assignments.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaySessions.map((session) => (
                      <ClassCard
                        key={session.entry.id}
                        session={session}
                        onSelect={(s) => setSelectedSession(s)}
                        settings={settings}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <MonthCalendar
                records={records}
                events={events}
                schedule={schedule}
                subjects={subjects}
                locations={locations}
                profile={profile}
                settings={settings}
                selectedDateStr={selectedCalendarDate}
                onSelectDate={handleCalendarDateSelect}
              />

              <MonthSummaryCard
                stats={currentMonthStats}
                settings={settings}
                monthName={todayDateObj.toLocaleDateString('en-US', { month: 'long' })}
              />
            </div>
          )}

          {/* TAB 3: INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Humorous attendance mood quote */}
              <HumorCard
                percentage={semesterStats.percentage}
                messages={funnyMessages}
              />

              {/* Target Simulator & Comeback Advice */}
              <ComebackCalculator
                stats={semesterStats}
                settings={settings}
              />

              {/* Subject Rankings & Breakdown */}
              <SubjectRankings
                stats={subjectRankings.subjectStats}
                leastAttended={subjectRankings.leastAttended}
                mostAttended={subjectRankings.mostAttended}
                midAttended={subjectRankings.midAttended}
                hasTies={subjectRankings.hasTies}
                targetAttendance={settings.attendanceTarget}
              />
            </div>
          )}

          {/* TAB 4: PROFILE & SETTINGS */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-200">
              <ProfileView
                profile={profile}
                settings={settings}
                onUpdateProfile={handleSaveProfile}
                onUpdateSettings={handleUpdateSettings}
                onOpenEditProfile={() => setIsOnboardingOpen(true)}
                onOpenApkGuide={() => setIsApkGuideOpen(true)}
                onOpenCampusGuide={() => setIsCampusGuideOpen(true)}
                onExportData={handleExportData}
                onImportData={handleImportClick}
                onResetDemoData={handleResetDemoData}
                onClearAllData={handleClearAllData}
                onLogout={handleStudentLogout}
                googleUser={googleUser}
                isGoogleLoading={isGoogleLoading}
                onGoogleSignIn={handleGoogleSignIn}
                onGoogleSignOut={handleGoogleSignOut}
                onShowToast={showToast}
              />
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Class Details & Attendance Action BottomSheet */}
        <ClassDetailSheet
          session={selectedSession}
          isOpen={Boolean(selectedSession)}
          onClose={() => setSelectedSession(null)}
          settings={settings}
          onRecordAttendance={handleRecordAttendance}
          onUpdateSettings={handleUpdateSettings}
          onShowToast={showToast}
        />

        {/* Date Details BottomSheet */}
        <DateDetailSheet
          dateStr={selectedCalendarDate}
          isOpen={isDateSheetOpen}
          onClose={() => setIsDateSheetOpen(false)}
          records={records}
          events={events}
          schedule={schedule}
          subjects={subjects}
          locations={locations}
          profile={profile}
          settings={settings}
          onSelectSession={(s) => {
            setIsDateSheetOpen(false);
            setSelectedSession(s);
          }}
        />

        {/* Campus Explorer Sheet (Gemini 3.8 Flash Maps Grounding) */}
        <CampusExplorerSheet
          isOpen={isCampusGuideOpen}
          onClose={() => setIsCampusGuideOpen(false)}
        />

        {/* Android APK Build Guide Modal */}
        <ApkGuideModal
          isOpen={isApkGuideOpen}
          onClose={() => setIsApkGuideOpen(false)}
          onShowToast={showToast}
        />

        {/* Profile Onboarding / Edit Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={handleSaveProfile}
          initialProfile={profile}
        />

        {/* Floating Toast Feedback */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A1A1F] border border-white/[0.12] text-xs font-medium text-[#F2F2F0] shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {toast.type === 'success' ? (
              <CheckCircle2 size={15} className="text-[#7FE3C0] shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle size={15} className="text-rose-400 shrink-0" />
            ) : (
              <Info size={15} className="text-[#7FE3C0] shrink-0" />
            )}
            <span>{toast.msg}</span>
          </div>
        )}
      </main>
    </div>
  );
}

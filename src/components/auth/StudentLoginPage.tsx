import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { BRANCHES, SEMESTERS, DEFAULT_PROFILE } from '../../constants/seedData';
import { GraduationCap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface StudentLoginPageProps {
  onLogin: (profile: StudentProfile) => void;
  currentProfile: StudentProfile;
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({
  onLogin,
  currentProfile,
}) => {
  const [rollNumber, setRollNumber] = useState(currentProfile?.rollNumber || '22C3048');
  const [name, setName] = useState(currentProfile?.name || 'Vaibhav Gour');
  const [collegeEmail, setCollegeEmail] = useState(currentProfile?.collegeEmail || 'vaibhavgour2006@gmail.com');
  const [branch, setBranch] = useState(
    currentProfile?.branch || 'Computer Science & Business Systems (CSBS)'
  );
  const [semester, setSemester] = useState(currentProfile?.semester || 5);
  const [semesterStartDate, setSemesterStartDate] = useState(
    currentProfile?.semesterStartDate || '2026-08-01'
  );
  const [semesterEndDate, setSemesterEndDate] = useState(
    currentProfile?.semesterEndDate || '2026-12-24'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!rollNumber.trim()) errs.rollNumber = 'Roll number cannot be empty';
    if (!name.trim()) errs.name = 'Full name cannot be empty';
    if (!branch) errs.branch = 'Please select your branch';
    if (!semesterStartDate) errs.semesterStartDate = 'Start date is required';
    if (!semesterEndDate) errs.semesterEndDate = 'End date is required';
    if (semesterStartDate && semesterEndDate && semesterEndDate <= semesterStartDate) {
      errs.semesterEndDate = 'End date must be after semester start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onLogin({
      id: currentProfile?.id || 'student_' + Date.now(),
      rollNumber: rollNumber.trim().toUpperCase(),
      name: name.trim(),
      collegeEmail: collegeEmail.trim() || undefined,
      branch,
      semester: Number(semester),
      semesterStartDate,
      semesterEndDate,
      targetAttendance: currentProfile?.targetAttendance || 75,
    });
  };

  const handleQuickDemoLogin = () => {
    onLogin(DEFAULT_PROFILE);
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0C] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle CRED-like radial glow background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7FE3C0]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand & Emblem */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-[24px] bg-[#1A1A1F] border border-white/[0.1] shadow-[-1px_-1px_3px_rgba(255,255,255,0.05),4px_8px_24px_rgba(0,0,0,0.8)] flex items-center justify-center text-[#7FE3C0] mx-auto animate-in zoom-in-90 duration-500">
            <GraduationCap size={32} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7FE3C0]/10 border border-[#7FE3C0]/25 text-[11px] font-semibold tracking-wider text-[#7FE3C0] uppercase mb-1">
              <Sparkles size={11} /> IET DAVV Indore
            </span>
            <h1 className="text-2xl font-semibold text-[#F2F2F0] tracking-tight">
              RollCall Login
            </h1>
            <p className="text-xs text-[#8A8A93] max-w-xs mx-auto mt-1">
              Sign in with your student credentials to access your personal timetable and geofenced attendance diary.
            </p>
          </div>
        </div>

        {/* Quick Demo Login Pill for effortless showcasing */}
        <div className="card-raised rounded-2xl p-3 flex items-center justify-between border-white/[0.08] bg-[#141418]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7FE3C0]/15 text-[#7FE3C0] flex items-center justify-center font-bold text-xs">
              VG
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F2F2F0] leading-tight">
                Quick Showcase Login
              </p>
              <p className="text-[10px] text-[#8A8A93] leading-tight mt-0.5">
                22C3048 • CSBS Sem 5
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="px-3 py-1.5 rounded-xl bg-[#7FE3C0] text-[#0A0A0C] font-semibold text-xs hover:bg-[#6edbb6] active:scale-95 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>One-Tap Sign In</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Login & Profile Setup Form */}
        <div className="card-raised rounded-[32px] p-6 border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Roll Number */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
                Student Roll Number *
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 22C3048"
                className="w-full px-4 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-sm text-[#F2F2F0] placeholder-[#5A5A63] focus:outline-none focus:border-[#7FE3C0]/60 font-mono"
              />
              {errors.rollNumber && (
                <p className="text-xs text-rose-400 mt-1">{errors.rollNumber}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vaibhav Gour"
                className="w-full px-4 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-sm text-[#F2F2F0] placeholder-[#5A5A63] focus:outline-none focus:border-[#7FE3C0]/60"
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
            </div>

            {/* College Email */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
                College Email <span className="text-[#5A5A63]">(Optional)</span>
              </label>
              <input
                type="email"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
                placeholder="vaibhavgour2006@gmail.com"
                className="w-full px-4 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-sm text-[#F2F2F0] placeholder-[#5A5A63] focus:outline-none focus:border-[#7FE3C0]/60"
              />
            </div>

            {/* Branch & Semester */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
                  Branch *
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#7FE3C0]/60"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b} className="bg-[#1A1A1F] text-[#F2F2F0]">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
                  Semester *
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#7FE3C0]/60"
                >
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s} className="bg-[#1A1A1F] text-[#F2F2F0]">
                      Sem {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Semester Start & End Dates */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
                  Semester Start *
                </label>
                <input
                  type="date"
                  value={semesterStartDate}
                  onChange={(e) => setSemesterStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-[#131316] border border-white/[0.08] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#7FE3C0]/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
                  Semester End *
                </label>
                <input
                  type="date"
                  value={semesterEndDate}
                  onChange={(e) => setSemesterEndDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-[#131316] border border-white/[0.08] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#7FE3C0]/60"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <Button type="submit" variant="primary" fullWidth size="lg">
                Log In & Open Dashboard
              </Button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-[#5A5A63]">
          RollCall • Offline Personal Attendance Diary for IET DAVV Students
        </p>
      </div>
    </div>
  );
};

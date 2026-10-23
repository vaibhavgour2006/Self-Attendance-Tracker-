import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { BRANCHES, SEMESTERS } from '../../constants/seedData';
import { Button } from '../common/Button';
import { GraduationCap, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialProfile,
}) => {
  const [rollNumber, setRollNumber] = useState(initialProfile?.rollNumber || '22C3048');
  const [name, setName] = useState(initialProfile?.name || 'Vaibhav Gour');
  const [collegeEmail, setCollegeEmail] = useState(initialProfile?.collegeEmail || 'vaibhavgour2006@gmail.com');
  const [branch, setBranch] = useState(
    initialProfile?.branch || 'Computer Science & Business Systems (CSBS)'
  );
  const [semester, setSemester] = useState(initialProfile?.semester || 5);
  const [semesterStartDate, setSemesterStartDate] = useState(
    initialProfile?.semesterStartDate || '2026-08-01'
  );
  const [semesterEndDate, setSemesterEndDate] = useState(
    initialProfile?.semesterEndDate || '2026-12-24'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!rollNumber.trim()) errs.rollNumber = 'Roll number cannot be empty';
    if (!name.trim()) errs.name = 'Full name cannot be empty';
    if (!branch) errs.branch = 'Please select your engineering branch';
    if (!semesterStartDate) errs.semesterStartDate = 'Start date is required';
    if (!semesterEndDate) errs.semesterEndDate = 'End date is required';
    if (semesterStartDate && semesterEndDate && semesterEndDate <= semesterStartDate) {
      errs.semesterEndDate = 'End date must be after semester start date';
    }
    if (collegeEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(collegeEmail.trim())) {
        errs.collegeEmail = 'Please provide a valid email format';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onComplete({
      id: initialProfile?.id || 'student_' + Date.now(),
      rollNumber: rollNumber.trim().toUpperCase(),
      name: name.trim(),
      collegeEmail: collegeEmail.trim() || undefined,
      branch,
      semester: Number(semester),
      semesterStartDate,
      semesterEndDate,
      targetAttendance: initialProfile?.targetAttendance || 75,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="card-raised rounded-[32px] w-full max-w-md p-6 max-h-[92vh] overflow-y-auto no-scrollbar border border-white/[0.1] shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#7FE3C0]/10 border border-[#7FE3C0]/25 flex items-center justify-center text-[#7FE3C0] mx-auto mb-3 shadow-inner">
            <GraduationCap size={24} />
          </div>
          <h2 className="text-xl font-semibold text-[#F2F2F0] tracking-tight">
            IET DAVV Student Profile
          </h2>
          <p className="text-xs text-[#8A8A93] mt-1">
            Personal attendance tracking diary for engineering scholars
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Roll Number */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
              Roll Number *
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. 22C3048"
              className="w-full px-4 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-sm text-[#F2F2F0] placeholder-[#5A5A63] focus:outline-none focus:border-[#7FE3C0]/50"
            />
            {errors.rollNumber && (
              <p className="text-xs text-rose-400 mt-1">{errors.rollNumber}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vaibhav Gour"
              className="w-full px-4 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-sm text-[#F2F2F0] placeholder-[#5A5A63] focus:outline-none focus:border-[#7FE3C0]/50"
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* College Email (Optional) */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
              College Email <span className="text-[#5A5A63]">(Optional)</span>
            </label>
            <input
              type="email"
              value={collegeEmail}
              onChange={(e) => setCollegeEmail(e.target.value)}
              placeholder="student@ietdavv.edu.in"
              className="w-full px-4 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-sm text-[#F2F2F0] placeholder-[#5A5A63] focus:outline-none focus:border-[#7FE3C0]/50"
            />
            {errors.collegeEmail && (
              <p className="text-xs text-rose-400 mt-1">{errors.collegeEmail}</p>
            )}
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
                className="w-full px-3 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#7FE3C0]/50"
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
                Sem *
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#7FE3C0]/50"
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s} className="bg-[#1A1A1F] text-[#F2F2F0]">
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Semester Dates */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                value={semesterStartDate}
                onChange={(e) => setSemesterStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#131316] border border-white/[0.08] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#7FE3C0]/50"
              />
              {errors.semesterStartDate && (
                <p className="text-[10px] text-rose-400 mt-1">{errors.semesterStartDate}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A8A93] mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                value={semesterEndDate}
                onChange={(e) => setSemesterEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#131316] border border-white/[0.08] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#7FE3C0]/50"
              />
              {errors.semesterEndDate && (
                <p className="text-[10px] text-rose-400 mt-1">{errors.semesterEndDate}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" variant="primary" fullWidth size="lg">
              Save & Open RollCall
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

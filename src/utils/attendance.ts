import {
  ScheduleEntry,
  AttendanceRecord,
  AcademicEvent,
  StudentProfile,
  AppSettings,
  Subject,
  ClassLiveStatus,
  ClassSessionItem,
  AttendanceStats,
  SubjectAttendanceStat,
  FunnyMessage,
  CampusLocation,
} from '../types';

/**
 * Checks if a given date string (YYYY-MM-DD) falls on a holiday or vacation.
 */
export function getAcademicEventForDate(
  dateStr: string,
  events: AcademicEvent[]
): AcademicEvent | undefined {
  return events.find((ev) => dateStr >= ev.startDate && dateStr <= ev.endDate);
}

/**
 * Determines whether a date is a college working day based on settings and academic events.
 */
export function isWorkingAcademicDay(
  dateStr: string,
  events: AcademicEvent[],
  settings: AppSettings,
  profile: StudentProfile
): boolean {
  // Must be within semester
  if (dateStr < profile.semesterStartDate || dateStr > profile.semesterEndDate) {
    return false;
  }

  // Check if it's a holiday/vacation
  const event = getAcademicEventForDate(dateStr, events);
  if (event && (event.eventType === 'holiday' || event.eventType === 'vacation')) {
    return false;
  }

  // Check weekday
  const d = new Date(dateStr + 'T12:00:00');
  const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();
  return settings.workingDays.includes(dayOfWeek);
}

/**
 * Calculates current real-time class status (upcoming, starting_soon, ongoing, ended)
 */
export function calculateClassLiveStatus(
  startTime: string,
  endTime: string,
  dateStr?: string,
  now = new Date()
): ClassLiveStatus {
  const todayStr = getLocalDateString(now);

  // If calculating for a past date
  if (dateStr && dateStr < todayStr) {
    return 'ended';
  }
  // If calculating for a future date
  if (dateStr && dateStr > todayStr) {
    return 'upcoming';
  }

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  if (currentTotalMinutes < startTotalMinutes - 15) {
    return 'upcoming';
  }
  if (currentTotalMinutes < startTotalMinutes) {
    return 'starting_soon';
  }
  if (currentTotalMinutes <= endTotalMinutes) {
    return 'ongoing';
  }
  return 'ended';
}

/**
 * Formats a Date object to YYYY-MM-DD in local time
 */
export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets all schedule entries for a specific day of week
 */
export function getEntriesForDayOfWeek(
  dayOfWeek: number,
  allEntries: ScheduleEntry[],
  branch: string,
  semester: number
): ScheduleEntry[] {
  return allEntries
    .filter((e) => e.dayOfWeek === dayOfWeek && e.branch === branch && e.semester === semester)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

/**
 * Assembles today's class session list with live status and attendance records
 */
export function getDayClassSessions(
  dateStr: string,
  allEntries: ScheduleEntry[],
  subjects: Subject[],
  locations: CampusLocation[],
  records: AttendanceRecord[],
  profile: StudentProfile
): ClassSessionItem[] {
  const dateObj = new Date(dateStr + 'T12:00:00');
  const dayOfWeek = dateObj.getDay() === 0 ? 7 : dateObj.getDay();

  const dayEntries = getEntriesForDayOfWeek(
    dayOfWeek,
    allEntries,
    profile.branch,
    profile.semester
  );

  const locationMap = new Map(locations.map((loc) => [loc.id, loc]));
  const subjectMap = new Map(subjects.map((sub) => [sub.id, sub]));

  return dayEntries.map((entry) => {
    const subject = subjectMap.get(entry.subjectId) || {
      id: entry.subjectId,
      name: 'Unknown Course',
      courseCode: 'N/A',
      branch: profile.branch,
      semester: profile.semester,
      credits: 3,
    };

    const location = locationMap.get(entry.locationId) || {
      id: entry.locationId,
      name: 'Academic Complex',
      building: 'Main Block',
      room: 'LT',
      latitude: 22.6808,
      longitude: 75.8775,
      geofenceRadiusMeters: 80,
    };

    const attendanceRecord = records.find(
      (r) => r.scheduleEntryId === entry.id && r.classDate === dateStr
    );

    const liveStatus = calculateClassLiveStatus(entry.startTime, entry.endTime, dateStr);

    return {
      entry,
      subject,
      location,
      liveStatus,
      attendanceRecord,
      dateStr,
    };
  });
}

/**
 * Calculates attendance statistics for a given list of records according to official formula:
 * Attendance % = Attended ÷ (Scheduled - Cancelled) * 100
 */
export function calculateAttendanceStats(
  records: AttendanceRecord[],
  settings: AppSettings
): AttendanceStats {
  const totalScheduled = records.length;
  let attended = 0;
  let absent = 0;
  let gt = 0;
  let cancelled = 0;

  for (const r of records) {
    if (r.status === 'attended') {
      attended++;
    } else if (r.status === 'absent') {
      absent++;
    } else if (r.status === 'gt') {
      gt++;
      // If configured in settings that GT counts as attended
      if (settings.gtCountsAsAttended) {
        attended++;
      }
    } else if (r.status === 'cancelled') {
      cancelled++;
    }
  }

  const eligibleTotal = totalScheduled - cancelled;
  const percentage =
    eligibleTotal > 0 ? Math.round((attended / eligibleTotal) * 1000) / 10 : 0;

  return {
    totalScheduled,
    attended,
    absent,
    gt,
    cancelled,
    eligibleTotal,
    percentage,
    hasClasses: eligibleTotal > 0,
  };
}

/**
 * Calculates overall semester attendance from start date to current or end date
 */
export function calculateSemesterStats(
  allRecords: AttendanceRecord[],
  profile: StudentProfile,
  settings: AppSettings,
  upToDateStr = getLocalDateString()
): AttendanceStats {
  const validRecords = allRecords.filter(
    (r) => r.classDate >= profile.semesterStartDate && r.classDate <= upToDateStr
  );
  return calculateAttendanceStats(validRecords, settings);
}

/**
 * Calculates monthly attendance statistics for a given Year and Month (1-12)
 */
export function calculateMonthStats(
  year: number,
  month: number,
  allRecords: AttendanceRecord[],
  profile: StudentProfile,
  settings: AppSettings
): AttendanceStats {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const monthRecords = allRecords.filter(
    (r) =>
      r.classDate.startsWith(prefix) &&
      r.classDate >= profile.semesterStartDate &&
      r.classDate <= profile.semesterEndDate
  );
  return calculateAttendanceStats(monthRecords, settings);
}

/**
 * Calculates subject-wise attendance and rankings (least, most, and median-ranked subjects)
 */
export function calculateSubjectRankings(
  subjects: Subject[],
  entries: ScheduleEntry[],
  records: AttendanceRecord[],
  settings: AppSettings,
  profile: StudentProfile
): {
  subjectStats: SubjectAttendanceStat[];
  leastAttended?: SubjectAttendanceStat;
  mostAttended?: SubjectAttendanceStat;
  midAttended?: SubjectAttendanceStat;
  hasTies: boolean;
} {
  const entrySubjectMap = new Map(entries.map((e) => [e.id, e.subjectId]));

  const statsMap = new Map<string, {
    attended: number;
    absent: number;
    gt: number;
    cancelled: number;
  }>();

  subjects.forEach((sub) => {
    statsMap.set(sub.id, { attended: 0, absent: 0, gt: 0, cancelled: 0 });
  });

  records.forEach((rec) => {
    const subjectId = entrySubjectMap.get(rec.scheduleEntryId);
    if (subjectId && statsMap.has(subjectId)) {
      const current = statsMap.get(subjectId)!;
      if (rec.status === 'attended') current.attended++;
      else if (rec.status === 'absent') current.absent++;
      else if (rec.status === 'gt') {
        current.gt++;
        if (settings.gtCountsAsAttended) current.attended++;
      } else if (rec.status === 'cancelled') current.cancelled++;
    }
  });

  const target = profile.targetAttendance || 75;

  const subjectStats: SubjectAttendanceStat[] = subjects.map((sub) => {
    const st = statsMap.get(sub.id) || { attended: 0, absent: 0, gt: 0, cancelled: 0 };
    const scheduled = st.attended + st.absent + st.gt + st.cancelled;
    const eligible = scheduled - st.cancelled;
    const percentage = eligible > 0 ? Math.round((st.attended / eligible) * 1000) / 10 : 0;

    // Comeback calculation:
    // classesNeededForTarget = ceil((target * eligible - 100 * attended) / (100 - target))
    let classesNeededForTarget = 0;
    let canBunkCount = 0;

    if (eligible > 0) {
      if (percentage < target) {
        const needed = Math.ceil((target * eligible - 100 * st.attended) / (100 - target));
        classesNeededForTarget = Math.max(0, needed);
      } else {
        // Can bunk: floor((100 * attended - target * eligible) / target)
        const canBunk = Math.floor((100 * st.attended - target * eligible) / target);
        canBunkCount = Math.max(0, canBunk);
      }
    }

    return {
      subject: sub,
      scheduled,
      attended: st.attended,
      absent: st.absent,
      gt: st.gt,
      cancelled: st.cancelled,
      eligible,
      percentage,
      bunkCount: st.absent + st.gt,
      classesNeededForTarget,
      canBunkCount,
    };
  });

  // Filter subjects that have at least 1 eligible class session
  const eligibleSubjectStats = subjectStats
    .filter((s) => s.eligible > 0)
    .sort((a, b) => a.percentage - b.percentage);

  if (eligibleSubjectStats.length === 0) {
    return { subjectStats, hasTies: false };
  }

  const leastAttended = eligibleSubjectStats[0];
  const mostAttended = eligibleSubjectStats[eligibleSubjectStats.length - 1];

  // Median subject calculation
  const midIndex = Math.floor(eligibleSubjectStats.length / 2);
  const midAttended = eligibleSubjectStats[midIndex];

  // Check if multiple subjects have equal values (ties)
  const percentages = eligibleSubjectStats.map((s) => s.percentage);
  const hasTies = new Set(percentages).size < percentages.length;

  return {
    subjectStats: eligibleSubjectStats,
    leastAttended,
    mostAttended,
    midAttended,
    hasTies,
  };
}

/**
 * Returns the humorous quote based on attendance percentage evaluated from lowest threshold upward
 */
export function getFunnyAttendanceMessage(
  percentage: number,
  messages: FunnyMessage[]
): string {
  // Sort messages ascending by threshold
  const sorted = [...messages].sort((a, b) => a.minPercent - b.minPercent);
  for (const m of sorted) {
    if (percentage >= m.minPercent && percentage < m.maxPercent) {
      return m.message;
    }
  }
  return percentage >= 85
    ? 'Attendance ki duniya mein aap hi legend ho.'
    : 'Bhagwan apki aatma ko shanti de';
}

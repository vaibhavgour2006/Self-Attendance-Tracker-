export type ClassType = 'Lecture' | 'Practical / Lab' | 'Workshop' | 'Tutorial' | 'Seminar';

export type AttendanceStatus = 'attended' | 'absent' | 'gt' | 'cancelled';

export type ClassLiveStatus = 'upcoming' | 'starting_soon' | 'ongoing' | 'ended';

export interface StudentProfile {
  id: string;
  rollNumber: string;
  name: string;
  collegeEmail?: string;
  branch: string;
  semester: number;
  semesterStartDate: string;
  semesterEndDate: string;
  targetAttendance: number;
}

export interface Subject {
  id: string;
  name: string;
  courseCode: string;
  branch: string;
  semester: number;
  credits: number;
  instructor?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  building: string;
  room: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  description?: string;
}

export interface ScheduleEntry {
  id: string;
  subjectId: string;
  dayOfWeek: number; // 1 = Monday, 2 = Tuesday, ... 7 = Sunday
  startTime: string; // '09:30'
  endTime: string;   // '10:30'
  classType: ClassType;
  locationId: string;
  branch: string;
  semester: number;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  scheduleEntryId: string;
  classDate: string; // 'YYYY-MM-DD'
  status: AttendanceStatus;
  markedAt: string;
  locationValidationState: 'verified_gps' | 'verified_demo' | 'failed' | 'not_required';
  isEdited: boolean;
  distanceMeters?: number;
}

export interface AcademicEvent {
  id: string;
  name: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
  eventType: 'holiday' | 'examination' | 'vacation' | 'special_working_day';
  notes?: string;
}

export interface AppSettings {
  workingDays: number[]; // e.g. [1, 2, 3, 4, 5]
  attendanceTarget: number; // default 75
  gtLabel: string; // default "GT 😛"
  gtCountsAsAttended: boolean; // default false
  geofenceRadius: number; // in meters, default 80
  geofenceEnabled: boolean; // default true
  demoLocationMode: boolean; // default true in web demo
  simulatedLocationStatus: 'inside' | 'outside';
}

export interface FunnyMessage {
  id: string;
  minPercent: number; // inclusive
  maxPercent: number; // exclusive
  message: string;
}

export interface ClassSessionItem {
  entry: ScheduleEntry;
  subject: Subject;
  location: CampusLocation;
  liveStatus: ClassLiveStatus;
  attendanceRecord?: AttendanceRecord;
  dateStr: string;
}

export interface AttendanceStats {
  totalScheduled: number;
  attended: number;
  absent: number;
  gt: number;
  cancelled: number;
  eligibleTotal: number; // scheduled - cancelled
  percentage: number;
  hasClasses: boolean;
}

export interface SubjectAttendanceStat {
  subject: Subject;
  scheduled: number;
  attended: number;
  absent: number;
  gt: number;
  cancelled: number;
  eligible: number;
  percentage: number;
  bunkCount: number;
  classesNeededForTarget: number;
  canBunkCount: number;
}

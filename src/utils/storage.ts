import {
  StudentProfile,
  Subject,
  CampusLocation,
  ScheduleEntry,
  AttendanceRecord,
  AcademicEvent,
  AppSettings,
  FunnyMessage,
} from '../types';
import {
  DEFAULT_LOCATIONS,
  DEFAULT_SUBJECTS,
  DEFAULT_SCHEDULE_ENTRIES,
  DEFAULT_ACADEMIC_EVENTS,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
  DEFAULT_FUNNY_MESSAGES,
} from '../constants/seedData';

const KEYS = {
  PROFILE: 'rollcall_profile',
  SUBJECTS: 'rollcall_subjects',
  LOCATIONS: 'rollcall_locations',
  SCHEDULE: 'rollcall_schedule',
  RECORDS: 'rollcall_records',
  EVENTS: 'rollcall_events',
  SETTINGS: 'rollcall_settings',
  FUNNY_MESSAGES: 'rollcall_funny_messages',
  IS_INITIALIZED: 'rollcall_initialized_v1',
};

// Generate realistic historic attendance records for past weeks of current semester
export function generateSeedAttendanceRecords(
  entries: ScheduleEntry[],
  events: AcademicEvent[],
  profile: StudentProfile
): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const startDate = new Date(profile.semesterStartDate);

  // If today is before semester start, return empty
  if (today < startDate) return records;

  // Generate for past 35 calendar days (excluding today)
  const daysBack = 35;
  const loopDate = new Date(today);
  loopDate.setDate(loopDate.getDate() - daysBack);

  // Holiday date set
  const isHoliday = (dStr: string) => {
    return events.some(
      (ev) => ev.eventType === 'holiday' || ev.eventType === 'vacation'
        ? dStr >= ev.startDate && dStr <= ev.endDate
        : false
    );
  };

  while (loopDate < today) {
    const dStr = loopDate.toISOString().split('T')[0];
    const dayOfWeek = loopDate.getDay() === 0 ? 7 : loopDate.getDay();

    // Check if it's within semester and not a holiday
    if (dStr >= profile.semesterStartDate && !isHoliday(dStr) && dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dayEntries = entries.filter((e) => e.dayOfWeek === dayOfWeek);

      dayEntries.forEach((entry, idx) => {
        // Pseudo-random deterministic distribution based on date and index
        const hash = (dStr.charCodeAt(dStr.length - 1) * 7 + idx * 13) % 100;
        let status: 'attended' | 'absent' | 'gt' | 'cancelled';

        if (hash < 70) {
          status = 'attended';
        } else if (hash < 82) {
          status = 'absent';
        } else if (hash < 93) {
          status = 'gt';
        } else {
          status = 'cancelled';
        }

        records.push({
          id: `rec_${dStr}_${entry.id}`,
          scheduleEntryId: entry.id,
          classDate: dStr,
          status,
          markedAt: `${dStr}T${entry.endTime}:00Z`,
          locationValidationState: status === 'attended' ? 'verified_gps' : 'not_required',
          isEdited: false,
          distanceMeters: status === 'attended' ? 14 : undefined,
        });
      });
    }

    loopDate.setDate(loopDate.getDate() + 1);
  }

  return records;
}

export const StorageService = {
  initialize() {
    const initialized = localStorage.getItem(KEYS.IS_INITIALIZED);
    if (!initialized) {
      this.resetDemoData();
      localStorage.setItem(KEYS.IS_INITIALIZED, 'true');
    }
  },

  getProfile(): StudentProfile {
    const raw = localStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  },

  saveProfile(profile: StudentProfile) {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getSubjects(): Subject[] {
    const raw = localStorage.getItem(KEYS.SUBJECTS);
    return raw ? JSON.parse(raw) : DEFAULT_SUBJECTS;
  },

  saveSubjects(subjects: Subject[]) {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  getLocations(): CampusLocation[] {
    const raw = localStorage.getItem(KEYS.LOCATIONS);
    return raw ? JSON.parse(raw) : DEFAULT_LOCATIONS;
  },

  saveLocations(locations: CampusLocation[]) {
    localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locations));
  },

  getSchedule(): ScheduleEntry[] {
    const raw = localStorage.getItem(KEYS.SCHEDULE);
    return raw ? JSON.parse(raw) : DEFAULT_SCHEDULE_ENTRIES;
  },

  saveSchedule(entries: ScheduleEntry[]) {
    localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(entries));
  },

  getRecords(): AttendanceRecord[] {
    const raw = localStorage.getItem(KEYS.RECORDS);
    return raw ? JSON.parse(raw) : [];
  },

  saveRecords(records: AttendanceRecord[]) {
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
  },

  saveRecord(record: AttendanceRecord) {
    const records = this.getRecords();
    const existingIdx = records.findIndex(
      (r) => r.scheduleEntryId === record.scheduleEntryId && r.classDate === record.classDate
    );
    if (existingIdx >= 0) {
      records[existingIdx] = { ...record, isEdited: true };
    } else {
      records.push(record);
    }
    this.saveRecords(records);
  },

  getEvents(): AcademicEvent[] {
    const raw = localStorage.getItem(KEYS.EVENTS);
    return raw ? JSON.parse(raw) : DEFAULT_ACADEMIC_EVENTS;
  },

  saveEvents(events: AcademicEvent[]) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  },

  getSettings(): AppSettings {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getFunnyMessages(): FunnyMessage[] {
    const raw = localStorage.getItem(KEYS.FUNNY_MESSAGES);
    return raw ? JSON.parse(raw) : DEFAULT_FUNNY_MESSAGES;
  },

  saveFunnyMessages(messages: FunnyMessage[]) {
    localStorage.setItem(KEYS.FUNNY_MESSAGES, JSON.stringify(messages));
  },

  exportAllData(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      subjects: this.getSubjects(),
      locations: this.getLocations(),
      schedule: this.getSchedule(),
      records: this.getRecords(),
      events: this.getEvents(),
      settings: this.getSettings(),
      funnyMessages: this.getFunnyMessages(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importAllData(jsonStr: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) this.saveProfile(data.profile);
      if (data.subjects) this.saveSubjects(data.subjects);
      if (data.locations) this.saveLocations(data.locations);
      if (data.schedule) this.saveSchedule(data.schedule);
      if (data.records) this.saveRecords(data.records);
      if (data.events) this.saveEvents(data.events);
      if (data.settings) this.saveSettings(data.settings);
      if (data.funnyMessages) this.saveFunnyMessages(data.funnyMessages);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid JSON format' };
    }
  },

  resetDemoData() {
    this.saveProfile(DEFAULT_PROFILE);
    this.saveSubjects(DEFAULT_SUBJECTS);
    this.saveLocations(DEFAULT_LOCATIONS);
    this.saveSchedule(DEFAULT_SCHEDULE_ENTRIES);
    this.saveEvents(DEFAULT_ACADEMIC_EVENTS);
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveFunnyMessages(DEFAULT_FUNNY_MESSAGES);

    const demoRecords = generateSeedAttendanceRecords(
      DEFAULT_SCHEDULE_ENTRIES,
      DEFAULT_ACADEMIC_EVENTS,
      DEFAULT_PROFILE
    );
    this.saveRecords(demoRecords);
  },

  clearAllData() {
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.SUBJECTS);
    localStorage.removeItem(KEYS.LOCATIONS);
    localStorage.removeItem(KEYS.SCHEDULE);
    localStorage.removeItem(KEYS.RECORDS);
    localStorage.removeItem(KEYS.EVENTS);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.FUNNY_MESSAGES);
    localStorage.removeItem(KEYS.IS_INITIALIZED);
  },
};

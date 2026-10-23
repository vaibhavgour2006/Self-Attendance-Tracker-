import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ScheduleEntry, Subject, CampusLocation, SubjectAttendanceStat } from '../types';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Workspace Scopes as configured
provider.addScope('https://www.googleapis.com/auth/calendar.events');
provider.addScope('https://www.googleapis.com/auth/tasks');

// In-memory token caching (MANDATORY: NEVER persist in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not retrieve access token from Google.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Creates an event in Google Calendar for a class session
 */
export async function createGoogleCalendarEvent(
  entry: ScheduleEntry,
  subject: Subject,
  location: CampusLocation,
  classDateStr: string
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, error: 'User is not authenticated with Google.' };
  }

  try {
    const startDateTime = `${classDateStr}T${entry.startTime}:00+05:30`;
    const endDateTime = `${classDateStr}T${entry.endTime}:00+05:30`;

    const eventPayload = {
      summary: `[RollCall] ${subject.name} (${entry.classType})`,
      location: `${location.name}, ${location.building}, IET DAVV Indore`,
      description: `Class Timetable - IET DAVV Personal Attendance Tracker\nCourse Code: ${subject.courseCode}\nInstructor: ${subject.instructor || 'Faculty'}\nRoom: ${location.room}\nNotes: ${entry.notes || 'None'}`,
      start: {
        dateTime: startDateTime,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Asia/Kolkata',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, eventId: data.id };
  } catch (err: any) {
    console.error('Failed to create calendar event:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Creates a task in Google Tasks for academic assignments or attendance goals
 */
export async function createGoogleTask(
  title: string,
  notes: string,
  dueDateStr?: string
): Promise<{ success: boolean; taskId?: string; error?: string }> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, error: 'User is not authenticated with Google.' };
  }

  try {
    const taskPayload: Record<string, any> = {
      title,
      notes,
    };

    if (dueDateStr) {
      taskPayload.due = `${dueDateStr}T18:00:00.000Z`;
    }

    const response = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskPayload),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, taskId: data.id };
  } catch (err: any) {
    console.error('Failed to create Google Task:', err);
    return { success: false, error: err.message };
  }
}

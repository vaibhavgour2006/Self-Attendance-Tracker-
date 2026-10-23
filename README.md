# 🎓 RollCall — IET DAVV Personal Attendance Tracker

> A minimalist, dark-aesthetic personal attendance tracking application crafted for engineering students of the **Institute of Engineering and Technology, Devi Ahilya Vishwavidyalaya (IET DAVV), Indore**.
> Inspired by the tactile, dark-luxury design principles of CRED: obsidian surfaces, soft mint accents, neumorphic elevations, fluid typography, and snappy interactive animations.

---

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-Android_APK_Ready-119EFF?style=flat-square&logo=capacitor&logoColor=white)
![Google Workspace](https://img.shields.io/badge/Google_Workspace-Calendar_%26_Tasks-4285F4?style=flat-square&logo=google&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_3.8_Flash-Maps_Grounding-8E75C4?style=flat-square&logo=googlegemini&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Web_%7C_Android-7FE3C0?style=flat-square)
![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square)

---

## 📖 Table of Contents

- [The Vision & Problem Statement](#-the-vision--problem-statement)
- [CRED-Inspired Design System](#-cred-inspired-design-system)
- [Key Features & Screens](#-key-features--screens)
  - [1. Today's Dashboard & Live Timetable](#1-todays-dashboard--live-timetable)
  - [2. Geofencing & Demo GPS Simulation](#2-geofencing--demo-gps-simulation)
  - [3. Full-Month Attendance Calendar](#3-full-month-attendance-calendar)
  - [4. Insights, Rankings & Comeback Simulator](#4-insights-rankings--comeback-simulator)
  - [5. Hindi Humor Engine](#5-hindi-humor-engine)
  - [6. Google Workspace Integration](#6-google-workspace-integration)
  - [7. Gemini 3.8 Flash Campus Explorer](#7-gemini-38-flash-campus-explorer)
  - [8. Student Login & Showcase Portal](#8-student-login--showcase-portal)
- [Snappy Micro-Animations](#-snappy-micro-animations)
- [Mathematical Formulas & Business Logic](#-mathematical-formulas--business-logic)
- [IET DAVV Campus Coordinates & Timetable](#-iet-davv-campus-coordinates--timetable)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Packaging as an Android APK (Capacitor)](#-packaging-as-an-android-apk-capacitor)
- [Privacy & Offline-First Guarantees](#-privacy--offline-first-guarantees)
- [License](#-license)

---

## 🌟 The Vision & Problem Statement

College attendance management is traditionally trapped in sluggish, outdated university portals or cumbersome spreadsheets. Official university ERPs fail students in five major areas:
1. **No Real-Time Clarity**: Students don't know at a glance whether their next class is starting soon, ongoing, or cancelled.
2. **Zero Location Awareness**: No physical proximity validation to prevent accidental incorrect records.
3. **No Distinction for Personal Statuses**: Missing a class to wander the campus or hang out at the canteen is culturally distinct from being officially absent or sick. In Indore colleges, this is universally known as **"GT"** (*Ghumne Gaye*).
4. **No Actionable Comeback Math**: Portals display raw percentages without calculating *how many consecutive lectures must be attended* to recover to the mandatory 75% threshold, or *how many classes can be safely skipped*.
5. **No Integration with Personal Calendars**: College timetables remain siloed away from students' primary Google Calendar and Google Tasks ecosystems.

**RollCall** solves this as a student-owned, offline-first personal attendance diary. It transforms tracking into a premium, tactile dashboard experience.

---

## 🎨 CRED-Inspired Design System

RollCall implements an understated, dark-mode design system where **restraint is the luxury**:

### Design Tokens
| Token | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| **Main Background** | `#0A0A0C` | Deep obsidian backdrop preventing eye fatigue |
| **Secondary Surface** | `#131316` | Inset panels, input fields, and pill containers |
| **Raised Card Surface** | `#1A1A1F` | Primary timetable cards and calendar panels |
| **Elevated Surface** | `#222228` | Hover states, active modals, and bottom sheets |
| **Primary Text** | `#F2F2F0` | High-contrast, warm white headlines & data |
| **Secondary Text** | `#8A8A93` | Muted descriptions, timestamps, and subtitles |
| **Tertiary Text** | `#5A5A63` | Subdued borders, icons, and footers |
| **Single Accent** | `#7FE3C0` | **Soft Mint**: Reserved strictly for key numbers, active states, and primary actions (≤ 5% screen real estate) |

### Typography
- **Display & Hero Numbers**: *Instrument Serif* — elegant, classical serif numerals for high-impact attendance percentages.
- **Interface & Microcopy**: *Plus Jakarta Sans* / *Inter* — geometric, highly legible sans-serif with consistent 8px grid hierarchy (`12 / 14 / 16 / 20 / 32 / 58`).

### Tactile Neumorphism
- **Raised Elevation**: `-1px -1px 2px rgba(255, 255, 255, 0.04), 3px 6px 18px rgba(0, 0, 0, 0.55)`
- **Inset Wells**: `inset 1px 2px 5px rgba(0, 0, 0, 0.6), inset -1px -1px 3px rgba(255, 255, 255, 0.03)`
- **Rounded Radii**: `20px` to `32px` on cards, bottom sheets, and pill buttons.

---

## 🚀 Key Features & Screens

### 1. Today's Dashboard & Live Timetable
- **Dynamic Header**: Real device date & time with localized weekday formatting, academic working day status, and one-tap calendar jump.
- **Hero Attendance Ring**: Circular progress arc that gradually sweeps and counts up from `0%` to the current semester percentage on load, with tap-to-replay.
- **Real-Time Clock Engine**: Background timer periodically evaluates class schedules every 15 seconds without requiring page refreshes:
  - `Upcoming`: Class scheduled for later today.
  - `Starting Soon`: Within 15 minutes of class start.
  - `Ongoing`: Current time falls between class start and end times (pulsing mint indicator).
  - `Ended`: Scheduled end time has elapsed.
- **4 Attendance Actions via Bottom Sheet**:
  1. **Attended**: Triggers Haversine GPS geofence validation.
  2. **Absent**: Recorded without geofence requirement.
  3. **GT 😛**: Indore's signature *Ghumne Gaye* status, preserved with emoji and configurable calculation rules.
  4. **Cancelled**: Excluded from both numerator and denominator.
  - *Prevents duplicate entries and marks manually adjusted records with an `Edited` badge.*

### 2. Geofencing & Demo GPS Simulation
- **Great-Circle Distance**: Employs the Haversine formula to compute exact distance in meters between the student's device and the class coordinates.
- **Configurable Radius**: Slider in Settings allows 40m–160m tolerance (default: 80m).
- **Demo Location Mode**: Because web browser previews cannot physically relocate to Indore, an interactive switch allows testers to simulate being:
  - **Inside Classroom**: (~15m away, verifies successfully).
  - **Outside Campus**: (~220m away, rejected with helpful distance feedback).
- **Hardware GPS Fallback**: When demo mode is toggled off, uses native `navigator.geolocation` / `@capacitor/geolocation` with high-accuracy GPS.

### 3. Full-Month Attendance Calendar
- **Interactive Date Grid**: Clean rounded-square date tiles with subtle, non-intrusive status dots (Mint = Attended, Rose = Absent, Amber = GT, Gray = Cancelled, Gold = Holiday).
- **Continuous Academic Holidays**: Supports multi-day university vacation ranges (e.g., Diwali Vacation from Nov 5–12 marks all dates in between).
- **Date Detail Sheet**: Tap any date to view the day's timetable, summary statistics, and retroactively record or correct entries.
- **Monthly Analytics Card**: Tracks attendance percentage specifically for the selected month.

### 4. Insights, Rankings & Comeback Simulator
- **Hero Semester Stats**: Attended, absent, GT, cancelled, and eligible non-cancelled sessions.
- **Target & Comeback Simulator (75% Target)**:
  - *If below target*: Computes the exact number of consecutive upcoming classes the student must attend without missing any.
  - *If above target*: Computes how many classes the student can safely bunk without falling below the 75% university requirement.
- **Ranked Subject Analytics**:
  - **Lowest Attended Subject** (with courses needed for recovery).
  - **Median Attended Subject** (middle-ranked course).
  - **Highest Attended Subject** (with safe bunk allowance).
  - *Includes automated tie indicators if multiple subjects share identical percentages.*
- **Staggered Bar Filling Animation**: Course progress bars animate from `0%` to their target width with staggered delay intervals on opening.

### 5. Hindi Humor Engine
RollCall pairs its refined dark UI with witty, contextual Hindi reactions evaluated strictly from the lowest threshold upward:

| Attendance Range | Prescribed Message |
| :---: | :--- |
| **< 30%** | *"Bhagwan apki aatma ko shanti de"* |
| **30% – 49.9%** | *"Ghee khatam 🫙"* |
| **50% – 74.9%** | *"Don't worry bhagwan sabka bhala hi karta hai 🙏🏽😭"* |
| **75% – 84.9%** | *"Abhi bhi comeback ka time hai."* |
| **≥ 85%** | *"Attendance ki duniya mein aap hi legend ho."* |

### 6. Google Workspace Integration
- **Client-Side OAuth (Firebase Auth)**: Authenticates securely via `GoogleAuthProvider` with in-memory token storage (tokens never touch `localStorage` or `sessionStorage`).
- **Google Calendar Sync**: Adds class sessions directly to the student's primary Google Calendar with location, subject code, instructor, and reminder popups.
- **Google Tasks Sync**: Automatically creates assignment deadlines and attendance recovery tasks in Google Tasks.
- **Official GSI Styling**: Implements the official Google Sign-In button specification and account connection controls.

### 7. Gemini 3.8 Flash Campus Explorer
- Powered by Google's modern `@google/genai` TypeScript SDK and Express backend proxy (`server.ts`).
- Uses `models/gemini-3.8-flash` with the `googleMaps` grounding tool to answer student queries about IET DAVV blocks, lecture halls, computer labs, library hours, and nearby food/canteen spots along Khandwa Road and Bhawarkua.
- **Verified Map Links**: Extracts ground truth Google Maps URIs directly from `groundingChunks.maps.uri`.

### 8. Student Login & Showcase Portal
- **Dedicated Login Screen (`StudentLoginPage.tsx`)**: Full-screen dark login portal with roll number, student name, branch, semester, and semester dates.
- **One-Tap Quick Demo Login**: Single tap button to sign in as sample student (`22C3048 — Vaibhav Gour`) for instant live demos.
- **Prominent Log Out Buttons**: Located in the top header and Profile screen to easily return to the login screen.

---

## ✨ Snappy Micro-Animations

The 4 primary bottom navigation items feature click-triggered SVG micro-interactions designed to make navigation tactile and responsive:

```
[ Today ]    ->  Clock hands rotate 360° in a spring sweep and settle back at 12:00
[ Calendar ] ->  Calendar page flips downward in 3D perspective and snaps back
[ Insights ] ->  Bar chart columns wave up and down in an equalizer rhythm
[ Profile ]  ->  Student silhouette pops up with bounce while checkmark tick pops into place
```

- **Gradual Circular Fill**: The main attendance circle features an SVG `stroke-dashoffset` interpolation alongside a numerical count-up over `1.2s`.
- **Opening Bar Expansion**: All subject progress bars expand smoothly from `0%` to their full width upon opening the Insights tab.
- **Subtle Tap Compression**: Interactive cards and buttons compress to `scale(0.97)` on active press.

---

## 📐 Mathematical Formulas & Business Logic

### 1. Attendance Percentage
$$\text{Attendance \%} = \frac{\text{Attended}}{\text{Scheduled} - \text{Cancelled}} \times 100$$
*Cancelled sessions are excluded from both numerator and denominator. If eligible sessions = 0, displays "No scheduled classes" rather than NaN.*

### 2. Comeback Target Calculation
To reach target percentage $T$ (e.g. $75\%$) from current attended $A$ and eligible total $N$:
$$\frac{A + x}{N + x} \ge \frac{T}{100} \implies x \ge \left\lceil \frac{T \cdot N - 100 \cdot A}{100 - T} \right\rceil$$

### 3. Safe Bunk Calculation
To determine how many classes $y$ can be missed while staying above target $T$:
$$\frac{A}{N + y} \ge \frac{T}{100} \implies y \le \left\lfloor \frac{100 \cdot A - T \cdot N}{T} \right\rfloor$$

### 4. Great-Circle Distance (Haversine Formula)
$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$d = 2 \cdot R \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
*where $R = 6,371,000\text{ meters}$, $\phi$ is latitude in radians, and $\lambda$ is longitude in radians.*

---

## 📍 IET DAVV Campus Coordinates & Timetable

Coordinates grounded at **IET DAVV, Khandwa Road, Indore, MP 452017**:

| Location Key | Name | Building / Wing | Latitude | Longitude | Radius |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `loc_m_block_lt1` | M-Block LT-1 | Main Academic Block (Ground Floor) | `22.6808° N` | `75.8775° E` | 80m |
| `loc_m_block_lt2` | M-Block LT-2 | Main Academic Block (First Floor) | `22.6808° N` | `75.8776° E` | 80m |
| `loc_e_block_204` | E-Block 204 | Electronics & CS Department Block | `22.6812° N` | `75.8781° E` | 80m |
| `loc_cc_lab_1` | CC Lab 1 | Computer Center Building | `22.6814° N` | `75.8779° E` | 75m |
| `loc_mech_workshop`| Mech Workshop| Central Workshop Complex | `22.6801° N` | `75.8771° E` | 90m |
| `loc_central_library`| Central Library| IET DAVV Central Library Hall | `22.6809° N` | `75.8786° E` | 80m |

### Supported Engineering Branches
- Computer Engineering (CS)
- Information Technology (IT)
- Computer Science & Business Systems (CSBS)
- Electronics & Telecommunication (ETC)
- Electronics & Instrumentation (EI)
- Mechanical Engineering (ME)
- Civil Engineering (CE)

---

## 📂 Project Architecture & Directory Structure

```
.
├── capacitor.config.ts            # Capacitor native packaging configuration
├── firebase-applet-config.json    # Firebase project configuration for Google Auth
├── index.html                     # HTML5 entry with Instrument Serif & Plus Jakarta fonts
├── package.json                   # Dependencies (React 19, Tailwind, Express, GenAI)
├── server.ts                      # Full-stack Express server with Gemini Maps Grounding
├── tsconfig.json                  # TypeScript compiler settings
├── vite.config.ts                 # Vite bundling setup
└── src
    ├── main.tsx                   # React root entry
    ├── App.tsx                    # Primary state coordinator, tabs & modals
    ├── index.css                  # Tailwind styles, neumorphic tokens & snappy keyframes
    ├── types
    │   └── index.ts               # Typed data contracts (Profile, Schedule, Attendance, etc.)
    ├── constants
    │   └── seedData.ts            # Realistic IET DAVV branches, subjects, locations & timetable
    ├── utils
    │   ├── attendance.ts          # Core math: 75% target, comeback simulator & ranking algorithms
    │   ├── geofence.ts            # Haversine distance engine & demo GPS simulator
    │   └── storage.ts             # LocalStorage persistence, backup export/import & demo reset
    ├── services
    │   ├── googleWorkspace.ts     # Firebase Auth, Google Calendar & Google Tasks API client
    │   └── geminiMaps.ts          # Gemini 3.8 Flash client for campus guidance
    └── components
        ├── auth
        │   └── StudentLoginPage.tsx     # Full-screen student login portal with quick demo sign-in
        ├── common
        │   ├── AttendanceRing.tsx       # SVG progress circle with count-up animation
        │   ├── Badge.tsx                # Status chips for live, class type, and attendance
        │   ├── BottomSheet.tsx          # Dismissible tactile bottom sheet
        │   ├── Button.tsx               # Primary, secondary, and ghost buttons with tap compression
        │   ├── GoogleSignInButton.tsx   # Official Google branded authentication button
        │   └── TabBar.tsx               # 4-icon navigation bar with animated SVG icons
        ├── today
        │   ├── ClassCard.tsx            # Chronological class cards with live indicators
        │   ├── ClassDetailSheet.tsx     # Bottom sheet for recording 4 attendance actions
        │   ├── HolidayBanner.tsx        # Multi-day holiday notice card
        │   └── TodayHeader.tsx          # Top date header, calendar toggle & logout button
        ├── calendar
        │   ├── MonthCalendar.tsx        # Full-month grid with status dots & holiday highlights
        │   ├── MonthSummaryCard.tsx     # Monthly attendance breakdown
        │   └── DateDetailSheet.tsx      # Daily schedule and retroactive attendance modifier
        ├── insights
        │   ├── ComebackCalculator.tsx   # Exact consecutive classes required to hit 75%
        │   ├── HumorCard.tsx            # Authentic Hindi attendance quotes
        │   └── SubjectRankings.tsx      # Lowest, median, and highest attended subject metrics
        └── profile
            ├── ApkGuideModal.tsx        # In-app Capacitor build and packaging guide
            ├── CampusExplorerSheet.tsx  # Gemini Maps Grounding campus landmarks guide
            ├── OnboardingModal.tsx      # Profile editing modal
            └── ProfileView.tsx          # Student profile, settings, Google sync & data tools
```

---

## 🛠️ Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**

### 1. Clone the repository
```bash
git clone https://github.com/your-username/iet-davv-rollcall.git
cd iet-davv-rollcall
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
# Optional Gemini API key for server-side Maps Grounding
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm run start
```

---

## 📱 Packaging as an Android APK (Capacitor)

The codebase is pre-configured with `capacitor.config.ts` (`in.ac.davv.iet.rollcall`). Follow these steps to generate a native Android APK:

### Step 1: Install Capacitor Android tooling
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/geolocation
```

### Step 2: Build the web application
```bash
npm run build
```

### Step 3: Initialize the native Android platform
```bash
npx cap add android
npx cap sync
```

### Step 4: Verify Android Permissions
Ensure `android/app/src/main/AndroidManifest.xml` includes GPS permissions:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### Step 5: Build Debug APK
You can open the project in Android Studio or build directly from the terminal:
```bash
# Open in Android Studio
npx cap open android

# Or compile APK via command line
cd android && ./gradlew assembleDebug
```

The APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔒 Privacy & Offline-First Guarantees

- **No Third-Party Telemetry**: RollCall contains zero external trackers or analytical beacons.
- **Local Data Storage**: All student records, roll numbers, attendance dates, and settings are saved strictly in device `localStorage`.
- **In-Memory OAuth Access**: Google access tokens are held exclusively in runtime memory and are cleared immediately upon sign-out.
- **Transparent Location Checks**: Geolocation coordinates are computed client-side using Haversine math and are never logged to external servers.

---

## 📄 License

This project is licensed under the [Apache 2.0 License](LICENSE).

---

*Crafted with precision for the students of Institute of Engineering and Technology, Devi Ahilya Vishwavidyalaya, Indore.*

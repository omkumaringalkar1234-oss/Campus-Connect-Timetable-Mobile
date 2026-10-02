# ⚡ Campus Connect Timetable (Android Mobile App)

A completely standalone, ultra-premium **3D Glassmorphic Android Mobile Application** dedicated solely to the College Timetable.

Built with **React Native**, **Expo (v57)**, **Expo Router**, and **TypeScript**.

---

## 💎 Features & Architecture

1. **Futuristic 3D Glassmorphism UI**
   - Electric cyan/blue neon glowing accents (`#00E5FF`) on deep cyber space backgrounds (`#060A17`).
   - Frosted translucent glass panels, soft drop shadows, and glowing border highlights.
   - Smooth floating ambient 3D glowing background orbs.

2. **Onboarding & Setup Flow**
   - **Step 1: USERNAME** — 3D Glass input card with focus glowing animation.
   - **Step 2: BRANCH** — 3D horizontal carousel slider. Center item snaps with 1.18x scale, cyan neon outline glow, and depth shadow.
   - **Step 3: DIVISION** — 3D horizontal carousel slider loaded dynamically based on chosen branch.
   - **Step 4: SUBDIVISION (BATCH)** — 3D horizontal carousel slider for practical lab batch selection.
   - **Progress Indicator** (`● ─── ○ ─── ○ ─── ○`) with glowing active step and back navigation (`← Back`).

3. **Timetable Dashboard**
   - **Personalized Header**: `GOOD MORNING / AFTERNOON, <USERNAME>`.
   - **Active Class Pill**: Displays current branch, division, and batch with an instant `CHANGE` button.
   - **Day Switcher**: Horizontal glowing pills for `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT`.
   - **Session Cards**: Lecture, Lab, and Tutorial badges, exact start/end times, room number, faculty name, and real-time `LIVE NOW` pulsing badges.
   - **100% Offline Capable**: Bundled with comprehensive timetable data and local offline storage via `AsyncStorage`.

---

## 🚀 Quick Start (Beginner Friendly)

### 1. Open Terminal
Open **Command Prompt** (cmd) or **PowerShell** on your computer.

### 2. Navigate to the Timetable App Directory
```bash
cd C:\Campus-Connect-Timetable-Mobile
```

### 3. Install Dependencies (if not already done)
```bash
npm install
```

### 4. Start the Application
```bash
npx expo start
```
Or to run directly in Android mode:
```bash
npx expo start --android
```

---

## 📱 How to Test on Your Android Phone

1. Install **Expo Go** from the Google Play Store on your Android phone.
2. Connect your Android phone to the same Wi-Fi network as your computer (or use USB debugging).
3. Run `npx expo start` on your computer.
4. Scan the QR code displayed in your terminal using the Expo Go app on Android.
5. The 3D Glassmorphic Timetable app will load immediately on your phone!

---

## 📦 How to Build the Standalone Android APK

To generate an `.apk` file that you can install directly on any Android phone without Expo Go:

### Option A: Cloud APK Build with EAS (Recommended & Easiest)
1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure the build:
   ```bash
   eas build:configure
   ```
4. Build the Android APK:
   ```bash
   eas build -p android --profile preview
   ```
5. Once completed, EAS will give you a direct download link for the `.apk` file. Download and install it on your Android device!

---

## 🛡️ Safety & Project Isolation
- This is a **100% separate, independent mobile application**.
- Your original web application (`C:\Campus-Connect-Mobile`) and its GitHub/Vercel deployment were **NOT modified, touched, or altered** in any way.

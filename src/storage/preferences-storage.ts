import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const TIMETABLE_PREFS_KEY = 'campus_timetable_user_prefs';

export interface UserTimetablePrefs {
  username: string;
  branchId: string;
  branchCode: string;
  branchLabel: string;
  divisionId: string;
  divisionLabel: string;
  subdivisionId: string;
  subdivisionLabel: string;
  updatedAt: string;
}

export async function getStoredTimetablePrefs(): Promise<UserTimetablePrefs | null> {
  try {
    let raw: string | null = null;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      raw = window.localStorage.getItem(TIMETABLE_PREFS_KEY);
    } else {
      raw = await AsyncStorage.getItem(TIMETABLE_PREFS_KEY);
    }
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Error reading timetable preferences:', error);
    return null;
  }
}

export async function saveStoredTimetablePrefs(prefs: UserTimetablePrefs): Promise<void> {
  try {
    const raw = JSON.stringify(prefs);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem(TIMETABLE_PREFS_KEY, raw);
    } else {
      await AsyncStorage.setItem(TIMETABLE_PREFS_KEY, raw);
    }
  } catch (error) {
    console.error('Error saving timetable preferences:', error);
  }
}

export async function clearStoredTimetablePrefs(): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.removeItem(TIMETABLE_PREFS_KEY);
    } else {
      await AsyncStorage.removeItem(TIMETABLE_PREFS_KEY);
    }
  } catch (error) {
    console.warn('Error clearing timetable preferences:', error);
  }
}

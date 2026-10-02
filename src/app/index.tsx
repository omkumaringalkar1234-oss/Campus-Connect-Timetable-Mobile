import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { getStoredTimetablePrefs } from '@/storage/preferences-storage';
import { BackgroundOrbs } from '@/components/BackgroundOrbs';
import { GlassColors } from '@/theme/glass-theme';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Short delay for smooth asset readiness
      await new Promise((resolve) => setTimeout(resolve, 350));
      const prefs = await getStoredTimetablePrefs();
      if (!mounted) return;

      if (prefs && prefs.branchId && prefs.divisionId && prefs.subdivisionId) {
        router.replace('/timetable');
      } else {
        router.replace('/setup');
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <BackgroundOrbs />
      <View style={styles.centerContent}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>⚡</Text>
        </View>
        <Text style={styles.title}>CAMPUS CONNECT</Text>
        <Text style={styles.subtitle}>TIMETABLE</Text>
        <ActivityIndicator color={GlassColors.cyan} size="small" style={{ marginTop: 24 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlassColors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 2,
    borderColor: GlassColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: GlassColors.textPrimary,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: GlassColors.cyan,
    letterSpacing: 4,
    marginTop: 4,
  },
});

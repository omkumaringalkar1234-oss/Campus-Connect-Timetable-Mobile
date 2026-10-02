import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Animated,
  Platform,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundOrbs } from '@/components/BackgroundOrbs';
import { TimetableSlotCard } from '@/components/TimetableSlotCard';
import { GlassCard } from '@/components/GlassCard';
import { TimetableService } from '@/services/timetable-service';
import {
  getStoredTimetablePrefs,
  UserTimetablePrefs,
} from '@/storage/preferences-storage';
import { TimetableEntry } from '@/data/timetable-data';
import { GlassColors } from '@/theme/glass-theme';

const DAYS = [
  { num: 1, code: 'MON', label: 'Monday' },
  { num: 2, code: 'TUE', label: 'Tuesday' },
  { num: 3, code: 'WED', label: 'Wednesday' },
  { num: 4, code: 'THU', label: 'Thursday' },
  { num: 5, code: 'FRI', label: 'Friday' },
  { num: 6, code: 'SAT', label: 'Saturday' },
];

export default function TimetableDashboardScreen() {
  const router = useRouter();

  const [prefs, setPrefs] = useState<UserTimetablePrefs | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const currentDay = new Date().getDay();
    // Sunday (0) maps to Monday (1)
    return currentDay === 0 ? 1 : currentDay;
  });

  const [lectures, setLectures] = useState<TimetableEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Real-time clock tick every 30s to update LIVE NOW badges
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Load preferences
  useEffect(() => {
    (async () => {
      const stored = await getStoredTimetablePrefs();
      if (!stored) {
        router.replace('/setup');
        return;
      }
      setPrefs(stored);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    })();
  }, []);

  // Load lectures whenever day or prefs change
  useEffect(() => {
    if (prefs) {
      const slots = TimetableService.getDayLectures(
        prefs.branchId,
        prefs.divisionId,
        prefs.subdivisionId,
        selectedDay
      );
      setLectures(slots);
    }
  }, [prefs, selectedDay]);

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentTime(new Date());
    if (prefs) {
      const slots = TimetableService.getDayLectures(
        prefs.branchId,
        prefs.divisionId,
        prefs.subdivisionId,
        selectedDay
      );
      setLectures(slots);
    }
    setTimeout(() => setRefreshing(false), 400);
  };

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'GOOD MORNING';
    if (hours < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const isTodaySelected = selectedDay === (currentTime.getDay() === 0 ? 1 : currentTime.getDay());

  // Count stats
  const totalClasses = lectures.length;
  const completedClasses = lectures.filter(
    (s) => isTodaySelected && TimetableService.getSlotStatus(s, currentTime) === 'ended'
  ).length;
  const upcomingClasses = totalClasses - completedClasses;

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackgroundOrbs />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={GlassColors.cyan}
            colors={[GlassColors.cyan]}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* ── TOP HEADER: GREETING & CLASS IDENTIFIER ────────────────── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.username}>
                {prefs?.username ? prefs.username.toUpperCase() : 'STUDENT'}
              </Text>
            </View>

            <View style={styles.offlineBadge}>
              <Ionicons name="cloud-offline-outline" size={13} color={GlassColors.cyan} />
              <Text style={styles.offlineBadgeText}>OFFLINE READY</Text>
            </View>
          </View>

          {/* ── CLASS INFO PILL WITH CHANGE CLASS BUTTON ──────────────── */}
          <GlassCard style={styles.classInfoCard}>
            <View style={styles.classInfoLeft}>
              <View style={styles.branchIcon}>
                <Ionicons name="school" size={20} color={GlassColors.cyan} />
              </View>
              <View>
                <Text style={styles.branchCode}>
                  {prefs?.branchCode || prefs?.branchId} • {prefs?.divisionLabel}
                </Text>
                <Text style={styles.batchLabel}>
                  Batch {prefs?.subdivisionLabel} • {prefs?.branchLabel}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/setup')}
              style={({ pressed }) => [styles.changeClassBtn, pressed && { opacity: 0.75 }]}
            >
              <Ionicons name="options-outline" size={15} color={GlassColors.cyan} />
              <Text style={styles.changeClassText}>CHANGE</Text>
            </Pressable>
          </GlassCard>

          {/* ── TODAY'S STATS ROW ─────────────────────────────────────── */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalClasses}</Text>
              <Text style={styles.statTitle}>TOTAL SESSIONS</Text>
            </View>

            <View style={[styles.statCard, styles.statCardActive]}>
              <Text style={[styles.statNumber, { color: GlassColors.cyan }]}>
                {isTodaySelected ? upcomingClasses : totalClasses}
              </Text>
              <Text style={styles.statTitle}>
                {isTodaySelected ? 'REMAINING' : 'SCHEDULED'}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: GlassColors.emerald }]}>
                {isTodaySelected ? completedClasses : 0}
              </Text>
              <Text style={styles.statTitle}>COMPLETED</Text>
            </View>
          </View>

          {/* ── HORIZONTAL DAY SWITCHER (MON - SAT) ────────────────────── */}
          <View style={styles.daySelectorArea}>
            <Text style={styles.sectionHeading}>SELECT DAY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayTrack}
            >
              {DAYS.map((d) => {
                const isSelected = selectedDay === d.num;
                const isToday = (currentTime.getDay() === 0 ? 1 : currentTime.getDay()) === d.num;

                return (
                  <Pressable
                    key={d.num}
                    onPress={() => setSelectedDay(d.num)}
                    style={[
                      styles.dayPill,
                      isSelected && styles.dayPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayCode,
                        isSelected && styles.dayCodeSelected,
                      ]}
                    >
                      {d.code}
                    </Text>
                    {isToday && (
                      <View
                        style={[
                          styles.todayDot,
                          isSelected && { backgroundColor: GlassColors.cyan },
                        ]}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* ── LECTURES / SESSIONS LIST ──────────────────────────────── */}
          <View style={styles.lecturesSection}>
            <View style={styles.lectureHeaderRow}>
              <Text style={styles.dayTitle}>
                {DAYS.find((d) => d.num === selectedDay)?.label.toUpperCase()} SCHEDULE
              </Text>
              <Text style={styles.lectureCount}>
                {lectures.length} {lectures.length === 1 ? 'class' : 'classes'}
              </Text>
            </View>

            {lectures.length === 0 ? (
              <GlassCard style={styles.emptyCard}>
                <Ionicons name="sunny-outline" size={44} color={GlassColors.cyan} style={{ marginBottom: 12 }} />
                <Text style={styles.emptyTitle}>No Classes Scheduled</Text>
                <Text style={styles.emptySub}>
                  Enjoy your free day or work on practical project assignments.
                </Text>
              </GlassCard>
            ) : (
              lectures.map((slot, index) => {
                const status = isTodaySelected
                  ? TimetableService.getSlotStatus(slot, currentTime)
                  : 'upcoming';

                return (
                  <TimetableSlotCard
                    key={`${slot.subject}_${slot.startTime}_${index}`}
                    slot={slot}
                    status={status}
                  />
                );
              })
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GlassColors.bgDark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  greeting: {
    fontSize: 12,
    fontWeight: '800',
    color: GlassColors.cyan,
    letterSpacing: 2.5,
  },
  username: {
    fontSize: 24,
    fontWeight: '900',
    color: GlassColors.textPrimary,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  offlineBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: GlassColors.cyan,
    letterSpacing: 1,
  },
  classInfoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  classInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  branchIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchCode: {
    fontSize: 16,
    fontWeight: '800',
    color: GlassColors.textPrimary,
    letterSpacing: 0.5,
  },
  batchLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: GlassColors.textMuted,
    marginTop: 2,
  },
  changeClassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderColor: GlassColors.cyan,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  changeClassText: {
    fontSize: 11,
    fontWeight: '800',
    color: GlassColors.cyan,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  statCardActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: GlassColors.textPrimary,
  },
  statTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: GlassColors.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  daySelectorArea: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: GlassColors.cyan,
    letterSpacing: 2,
    marginBottom: 10,
  },
  dayTrack: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  dayPill: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(10, 16, 32, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayPillSelected: {
    borderColor: GlassColors.cyan,
    backgroundColor: 'rgba(0, 229, 255, 0.18)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(0, 229, 255, 0.65)',
      } as any,
      default: {
        shadowColor: GlassColors.cyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 8,
      },
    }),
  },
  dayCode: {
    fontSize: 13,
    fontWeight: '800',
    color: GlassColors.textMuted,
    letterSpacing: 0.5,
  },
  dayCodeSelected: {
    color: GlassColors.cyan,
    fontWeight: '900',
  },
  todayDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  lecturesSection: {
    marginTop: 4,
  },
  lectureHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: GlassColors.textPrimary,
    letterSpacing: 1.5,
  },
  lectureCount: {
    fontSize: 12,
    fontWeight: '700',
    color: GlassColors.textMuted,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: GlassColors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: GlassColors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
});

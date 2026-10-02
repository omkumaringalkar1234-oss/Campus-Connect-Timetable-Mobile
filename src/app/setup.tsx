import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundOrbs } from '@/components/BackgroundOrbs';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { GlassInput } from '@/components/GlassInput';
import { StepProgress } from '@/components/StepProgress';
import { Carousel3D } from '@/components/Carousel3D';
import { TimetableService, BranchOption, DivisionOption, SubdivisionOption } from '@/services/timetable-service';
import { saveStoredTimetablePrefs, getStoredTimetablePrefs } from '@/storage/preferences-storage';
import { GlassColors } from '@/theme/glass-theme';

export default function SetupScreen() {
  const router = useRouter();

  // Wizard state: 0 = Username, 1 = Branch, 2 = Division, 3 = Subdivision
  const [step, setStep] = useState(0);

  // Form selections
  const [username, setUsername] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<BranchOption | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<DivisionOption | null>(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState<SubdivisionOption | null>(null);

  // Dynamic datasets from actual timetable data
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [divisions, setDivisions] = useState<DivisionOption[]>([]);
  const [subdivisions, setSubdivisions] = useState<SubdivisionOption[]>([]);

  // Screen animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Initialize data
  useEffect(() => {
    const branchList = TimetableService.getBranches();
    setBranches(branchList);

    // Pre-populate if already in storage
    (async () => {
      const saved = await getStoredTimetablePrefs();
      if (saved) {
        if (saved.username) setUsername(saved.username);
        const b = branchList.find((item) => item.id === saved.branchId || item.code === saved.branchCode);
        if (b) {
          setSelectedBranch(b);
          const divList = TimetableService.getDivisionsForBranch(b.id);
          setDivisions(divList);
          const d = divList.find((item) => item.id === saved.divisionId);
          if (d) {
            setSelectedDivision(d);
            const subList = TimetableService.getSubdivisions(b.id, d.id);
            setSubdivisions(subList);
            const s = subList.find((item) => item.id === saved.subdivisionId);
            if (s) setSelectedSubdivision(s);
          }
        }
      } else if (branchList.length > 0) {
        // Default to first branch if empty
        const defaultBranch = branchList.find((b) => b.code === 'IT') || branchList[0];
        setSelectedBranch(defaultBranch);
      }
    })();
  }, []);

  // Update divisions whenever branch changes
  useEffect(() => {
    if (selectedBranch) {
      const divList = TimetableService.getDivisionsForBranch(selectedBranch.id);
      setDivisions(divList);
      if (divList.length > 0) {
        // Keep previous division if exists, otherwise first
        const matched = divList.find((d) => d.id === selectedDivision?.id) || divList[0];
        setSelectedDivision(matched);
      } else {
        setSelectedDivision(null);
      }
    }
  }, [selectedBranch?.id]);

  // Update subdivisions whenever division changes
  useEffect(() => {
    if (selectedBranch && selectedDivision) {
      const subList = TimetableService.getSubdivisions(selectedBranch.id, selectedDivision.id);
      setSubdivisions(subList);
      if (subList.length > 0) {
        const matched = subList.find((s) => s.id === selectedSubdivision?.id) || subList[0];
        setSelectedSubdivision(matched);
      } else {
        setSelectedSubdivision(null);
      }
    }
  }, [selectedBranch?.id, selectedDivision?.id]);

  const transitionToStep = (newStep: number) => {
    const direction = newStep > step ? 1 : -1;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -direction * 40,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(newStep);
      slideAnim.setValue(direction * 40);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = async () => {
    if (step === 0) {
      if (!username.trim()) return;
      transitionToStep(1);
    } else if (step === 1) {
      if (!selectedBranch) return;
      transitionToStep(2);
    } else if (step === 2) {
      if (!selectedDivision) return;
      transitionToStep(3);
    } else if (step === 3) {
      // Save and finish
      if (!selectedBranch || !selectedDivision || !selectedSubdivision) return;

      await saveStoredTimetablePrefs({
        username: username.trim(),
        branchId: selectedBranch.id,
        branchCode: selectedBranch.code,
        branchLabel: selectedBranch.name,
        divisionId: selectedDivision.id,
        divisionLabel: selectedDivision.name,
        subdivisionId: selectedSubdivision.id,
        subdivisionLabel: selectedSubdivision.name,
        updatedAt: new Date().toISOString(),
      });

      router.replace('/timetable');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      transitionToStep(step - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackgroundOrbs />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header & Navigation */}
        <View style={styles.topNav}>
          {step > 0 ? (
            <Pressable onPress={handleBack} hitSlop={12} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={20} color={GlassColors.cyan} />
              <Text style={styles.backBtnText}>Back</Text>
            </Pressable>
          ) : (
            <View style={{ width: 60 }} />
          )}

          <View style={styles.headerTag}>
            <View style={styles.headerTagDot} />
            <Text style={styles.headerTagText}>JSPM TATHAWADE</Text>
          </View>

          <View style={{ width: 60 }} />
        </View>

        {/* Step Progress Indicator */}
        <StepProgress currentStep={step} />

        {/* Main Animated Step Content */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* ── STEP 0: USERNAME ────────────────────────────────────────── */}
          {step === 0 && (
            <ScrollView contentContainerStyle={styles.step0Content} showsVerticalScrollIndicator={false}>
              <View style={styles.titleWrap}>
                <Text style={styles.welcomeText}>WELCOME</Text>
                <Text style={styles.mainTitle}>Enter Your Identity</Text>
                <Text style={styles.subTitle}>
                  Your personalized timetable dashboard will be tailored to your name and section.
                </Text>
              </View>

              <GlassCard glow style={styles.inputCard}>
                <Text style={styles.inputLabel}>USERNAME</Text>
                <GlassInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="ENTER USERNAME"
                  autoFocus
                  onSubmitEditing={handleNext}
                />
              </GlassCard>

              <View style={styles.buttonBottomArea}>
                <GlassButton
                  title="CONTINUE"
                  onPress={handleNext}
                  disabled={!username.trim()}
                  iconName="arrow-forward"
                />
              </View>
            </ScrollView>
          )}

          {/* ── STEP 1: BRANCH ──────────────────────────────────────────── */}
          {step === 1 && (
            <View style={styles.carouselStepContent}>
              <View style={styles.titleWrap}>
                <Text style={styles.stepTag}>STEP 2 OF 4</Text>
                <Text style={styles.mainTitle}>SELECT YOUR BRANCH</Text>
                <Text style={styles.subTitle}>Swipe left/right or tap to select your engineering branch</Text>
              </View>

              {branches.length > 0 && (
                <Carousel3D
                  data={branches}
                  selectedId={selectedBranch?.id || branches[0].id}
                  onSelect={(b) => setSelectedBranch(b)}
                  type="branch"
                  cardWidth={115}
                  cardHeight={140}
                />
              )}

              {selectedBranch && (
                <View style={styles.selectionSummary}>
                  <Text style={styles.selectionSummaryEmoji}>{selectedBranch.emoji}</Text>
                  <Text style={styles.selectionSummaryText}>{selectedBranch.name}</Text>
                </View>
              )}

              <View style={styles.buttonBottomArea}>
                <GlassButton
                  title="CONTINUE"
                  onPress={handleNext}
                  disabled={!selectedBranch}
                  iconName="arrow-forward"
                />
              </View>
            </View>
          )}

          {/* ── STEP 2: DIVISION ────────────────────────────────────────── */}
          {step === 2 && (
            <View style={styles.carouselStepContent}>
              <View style={styles.titleWrap}>
                <Text style={styles.stepTag}>STEP 3 OF 4</Text>
                <Text style={styles.mainTitle}>SELECT YOUR DIVISION</Text>
                <Text style={styles.subTitle}>
                  {selectedBranch?.name} — Choose your designated class section
                </Text>
              </View>

              {divisions.length > 0 ? (
                <Carousel3D
                  data={divisions}
                  selectedId={selectedDivision?.id || divisions[0].id}
                  onSelect={(d) => setSelectedDivision(d)}
                  type="division"
                  cardWidth={95}
                  cardHeight={135}
                />
              ) : (
                <Text style={styles.emptyNote}>No divisions configured for this branch</Text>
              )}

              {selectedDivision && (
                <View style={styles.selectionSummary}>
                  <Text style={styles.selectionSummaryText}>{selectedDivision.name}</Text>
                </View>
              )}

              <View style={styles.buttonBottomArea}>
                <GlassButton
                  title="CONTINUE"
                  onPress={handleNext}
                  disabled={!selectedDivision}
                  iconName="arrow-forward"
                />
              </View>
            </View>
          )}

          {/* ── STEP 3: SUBDIVISION / BATCH ─────────────────────────────── */}
          {step === 3 && (
            <View style={styles.carouselStepContent}>
              <View style={styles.titleWrap}>
                <Text style={styles.stepTag}>STEP 4 OF 4</Text>
                <Text style={styles.mainTitle}>SELECT YOUR SUBDIVISION</Text>
                <Text style={styles.subTitle}>
                  {selectedDivision?.name} — Select your practical lab batch
                </Text>
              </View>

              {subdivisions.length > 0 ? (
                <Carousel3D
                  data={subdivisions}
                  selectedId={selectedSubdivision?.id || subdivisions[0].id}
                  onSelect={(s) => setSelectedSubdivision(s)}
                  type="batch"
                  cardWidth={105}
                  cardHeight={135}
                />
              ) : (
                <Text style={styles.emptyNote}>No batches configured for this division</Text>
              )}

              {selectedSubdivision && (
                <View style={styles.selectionSummary}>
                  <Text style={styles.selectionSummaryText}>Batch {selectedSubdivision.name}</Text>
                </View>
              )}

              <View style={styles.buttonBottomArea}>
                <GlassButton
                  title="VIEW MY TIMETABLE"
                  onPress={handleNext}
                  disabled={!selectedSubdivision}
                  iconName="sparkles-outline"
                />
              </View>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GlassColors.bgDark,
  },
  keyboardAvoid: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    paddingBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: GlassColors.cyan,
    marginLeft: 2,
  },
  headerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  headerTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GlassColors.cyan,
    marginRight: 6,
  },
  headerTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: GlassColors.cyan,
    letterSpacing: 1.5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  step0Content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  carouselStepContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  titleWrap: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '900',
    color: GlassColors.cyan,
    letterSpacing: 4,
    marginBottom: 6,
  },
  stepTag: {
    fontSize: 11,
    fontWeight: '800',
    color: GlassColors.cyan,
    letterSpacing: 2,
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: GlassColors.textPrimary,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: GlassColors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 320,
  },
  inputCard: {
    marginVertical: 24,
    width: '100%',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: GlassColors.cyan,
    letterSpacing: 2,
    marginBottom: 12,
  },
  selectionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 30,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  selectionSummaryEmoji: {
    fontSize: 18,
  },
  selectionSummaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: GlassColors.textPrimary,
    letterSpacing: 0.5,
  },
  emptyNote: {
    fontSize: 14,
    color: GlassColors.textDim,
    textAlign: 'center',
    marginVertical: 40,
  },
  buttonBottomArea: {
    paddingHorizontal: 24,
    width: '100%',
    marginTop: 16,
  },
});

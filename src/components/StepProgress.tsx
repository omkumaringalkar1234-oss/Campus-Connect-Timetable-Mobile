import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassColors } from '@/theme/glass-theme';

const STEPS = ['USER', 'BRANCH', 'DIVISION', 'BATCH'];

interface StepProgressProps {
  currentStep: number; // 0, 1, 2, 3
}

export function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <View style={styles.container}>
      {STEPS.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={label}>
            {/* Step Node */}
            <View style={styles.nodeWrapper}>
              <View
                style={[
                  styles.node,
                  isCompleted && styles.nodeCompleted,
                  isActive && styles.nodeActive,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={12} color="#000" />
                ) : (
                  <View style={[styles.innerDot, isActive && styles.innerDotActive]} />
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isCompleted && styles.labelCompleted,
                  isActive && styles.labelActive,
                ]}
              >
                {label}
              </Text>
            </View>

            {/* Connecting line */}
            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.line,
                  index < currentStep && styles.lineCompleted,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  nodeWrapper: {
    alignItems: 'center',
  },
  node: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCompleted: {
    backgroundColor: GlassColors.cyan,
    borderColor: GlassColors.cyan,
  },
  nodeActive: {
    borderColor: GlassColors.cyan,
    backgroundColor: GlassColors.cyanDim,
    shadowColor: GlassColors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  innerDotActive: {
    backgroundColor: GlassColors.cyan,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  lineCompleted: {
    backgroundColor: GlassColors.cyan,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: GlassColors.textDim,
    letterSpacing: 1,
    marginTop: 6,
  },
  labelCompleted: {
    color: 'rgba(0, 229, 255, 0.7)',
  },
  labelActive: {
    color: GlassColors.cyan,
    fontWeight: '800',
  },
});

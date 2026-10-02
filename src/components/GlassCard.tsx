import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { GlassColors, GlassShadows } from '@/theme/glass-theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glow?: boolean;
  borderCyan?: boolean;
}

export function GlassCard({ children, style, glow = false, borderCyan = false }: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        borderCyan && styles.borderCyan,
        glow && styles.glow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: GlassColors.bgCard,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: GlassColors.borderLight,
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      } as any,
      default: GlassShadows.cardSoft,
    }),
  },
  borderCyan: {
    borderColor: GlassColors.cyanBorder,
  },
  glow: {
    borderColor: GlassColors.cyan,
    ...Platform.select({
      web: {
        boxShadow: '0 0 30px rgba(0, 229, 255, 0.35), inset 0 0 15px rgba(0, 229, 255, 0.12)',
      } as any,
      default: GlassShadows.cyanGlow,
    }),
  },
});

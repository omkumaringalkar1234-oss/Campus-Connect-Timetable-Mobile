import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassColors, GlassShadows } from '@/theme/glass-theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function GlassButton({
  title,
  onPress,
  style,
  disabled = false,
  loading = false,
  iconName = 'arrow-forward',
  variant = 'primary',
}: GlassButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  };

  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          isPrimary && styles.primaryBtn,
          !isPrimary && !isGhost && styles.secondaryBtn,
          isGhost && styles.ghostBtn,
          disabled && styles.disabledBtn,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={GlassColors.cyan} size="small" />
        ) : (
          <>
            <Text
              style={[
                styles.btnText,
                isPrimary && styles.primaryText,
                isGhost && styles.ghostText,
                disabled && styles.disabledText,
              ]}
            >
              {title}
            </Text>
            {iconName && (
              <Ionicons
                name={iconName}
                size={18}
                color={
                  disabled
                    ? GlassColors.textDim
                    : isPrimary
                    ? GlassColors.cyan
                    : GlassColors.textSecondary
                }
                style={styles.icon}
              />
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  primaryBtn: {
    backgroundColor: GlassColors.cyanDim,
    borderWidth: 2,
    borderColor: GlassColors.cyan,
    ...Platform.select({
      web: {
        boxShadow: '0 0 24px rgba(0, 229, 255, 0.65), inset 0 0 10px rgba(0, 229, 255, 0.25)',
        cursor: 'pointer',
      } as any,
      default: GlassShadows.neonButton,
    }),
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: GlassColors.borderLight,
  },
  ghostBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  disabledBtn: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: GlassColors.textPrimary,
  },
  primaryText: {
    color: GlassColors.cyan,
    ...Platform.select({
      web: {
        textShadow: '0 0 10px rgba(0, 229, 255, 0.8)',
      } as any,
    }),
  },
  ghostText: {
    color: GlassColors.textMuted,
  },
  disabledText: {
    color: GlassColors.textDim,
  },
  icon: {
    marginLeft: 8,
  },
});

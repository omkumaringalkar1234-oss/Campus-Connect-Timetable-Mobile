import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassColors } from '@/theme/glass-theme';

interface GlassInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onSubmitEditing?: () => void;
}

export function GlassInput({
  value,
  onChangeText,
  placeholder = 'ENTER USERNAME',
  autoFocus = false,
  secureTextEntry = false,
  iconName = 'person-outline',
  autoCapitalize = 'words',
  onSubmitEditing,
}: GlassInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [GlassColors.borderLight, GlassColors.cyan],
  });

  const backgroundColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.05)', 'rgba(0, 229, 255, 0.08)'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor,
          backgroundColor,
          ...Platform.select({
            web: {
              boxShadow: isFocused
                ? '0 0 28px rgba(0, 229, 255, 0.5), inset 0 0 10px rgba(0, 229, 255, 0.15)'
                : 'none',
            } as any,
            default: {
              shadowColor: GlassColors.cyan,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isFocused ? 0.75 : 0,
              shadowRadius: isFocused ? 16 : 0,
              elevation: isFocused ? 8 : 0,
            },
          }),
        },
      ]}
    >
      <Ionicons
        name={iconName}
        size={20}
        color={isFocused ? GlassColors.cyan : GlassColors.textMuted}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={GlassColors.textDim}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onSubmitEditing}
      />

      {secureTextEntry ? (
        <Pressable
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          hitSlop={12}
          style={styles.actionBtn}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={isPasswordVisible ? GlassColors.cyan : GlassColors.textMuted}
          />
        </Pressable>
      ) : value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} style={styles.actionBtn}>
          <Ionicons name="close-circle" size={18} color={GlassColors.textMuted} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      } as any,
    }),
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: GlassColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionBtn: {
    padding: 6,
  },
});

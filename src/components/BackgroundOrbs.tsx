import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View, Platform } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface OrbProps {
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay?: number;
}

function FloatingOrb({ color, size, initialX, initialY, duration, delay = 0 }: OrbProps) {
  const posX = useRef(new Animated.Value(initialX)).current;
  const posY = useRef(new Animated.Value(initialY)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0.22,
      duration: 1800,
      delay,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    const animate = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(posX, {
            toValue: initialX + 40,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(posX, {
            toValue: initialX - 35,
            duration: duration * 1.1,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(posX, {
            toValue: initialX,
            duration: duration * 0.95,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
        Animated.sequence([
          Animated.timing(posY, {
            toValue: initialY - 45,
            duration: duration * 1.2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(posY, {
            toValue: initialY + 40,
            duration: duration * 0.9,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(posY, {
            toValue: initialY,
            duration: duration * 1.1,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.15,
            duration: duration * 0.85,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: duration * 1.05,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: duration * 0.9,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
      ]).start(animate);
    };

    const timer = setTimeout(animate, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ translateX: posX }, { translateY: posY }, { scale }],
        },
      ]}
    />
  );
}

export function BackgroundOrbs() {
  return (
    <View style={styles.container} pointerEvents="none">
      <FloatingOrb color="#00E5FF" size={260} initialX={-60} initialY={-30} duration={7000} delay={0} />
      <FloatingOrb color="#7C3AED" size={240} initialX={SCREEN_W > 400 ? 180 : 120} initialY={120} duration={8500} delay={300} />
      <FloatingOrb color="#0EA5E9" size={200} initialX={20} initialY={380} duration={6200} delay={600} />
      <FloatingOrb color="#A855F7" size={170} initialX={SCREEN_W > 400 ? 160 : 100} initialY={560} duration={9000} delay={900} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: -1,
  },
  orb: {
    position: 'absolute',
    ...Platform.select({
      web: {
        filter: 'blur(60px)',
      } as any,
      default: {},
    }),
  },
});

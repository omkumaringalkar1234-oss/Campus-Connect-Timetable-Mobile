import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

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
      useNativeDriver: true,
    }).start();

    const animate = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(posX, {
            toValue: initialX + 90,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(posX, {
            toValue: initialX - 70,
            duration: duration * 1.1,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(posX, {
            toValue: initialX,
            duration: duration * 0.95,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(posY, {
            toValue: initialY - 110,
            duration: duration * 1.2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(posY, {
            toValue: initialY + 80,
            duration: duration * 0.9,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(posY, {
            toValue: initialY,
            duration: duration * 1.1,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.3,
            duration: duration * 0.85,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.85,
            duration: duration * 1.05,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: duration * 0.9,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
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
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <FloatingOrb color="#00E5FF" size={320} initialX={-80} initialY={-40} duration={7000} delay={0} />
      <FloatingOrb color="#7C3AED" size={280} initialX={SCREEN_W - 140} initialY={SCREEN_H * 0.25} duration={8500} delay={300} />
      <FloatingOrb color="#0EA5E9" size={240} initialX={40} initialY={SCREEN_H * 0.65} duration={6200} delay={600} />
      <FloatingOrb color="#A855F7" size={190} initialX={SCREEN_W - 100} initialY={SCREEN_H * 0.82} duration={9000} delay={900} />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    filter: 'blur(60px)',
  },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  Linking,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassColors } from '@/theme/glass-theme';

const INSTAGRAM_URL = 'https://www.instagram.com/invites/contact/?utm_content=olimohv&stkn=8zywe3hq9mhm';

export function Watermark() {
  const [expanded, setExpanded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (expanded) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 70,
          friction: 7,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [expanded]);

  const handleOpenInstagram = async () => {
    try {
      const supported = await Linking.canOpenURL(INSTAGRAM_URL);
      if (supported) {
        await Linking.openURL(INSTAGRAM_URL);
      } else {
        await Linking.openURL(INSTAGRAM_URL);
      }
    } catch (e) {
      // Fallback
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(INSTAGRAM_URL, '_blank');
      }
    }
  };

  return (
    <>
      {/* ── SMALL FLOATING WATERMARK BADGE ─────────────────────── */}
      <View style={styles.floatingContainer} pointerEvents="box-none">
        <Pressable
          onPress={() => setExpanded(true)}
          style={({ pressed }) => [
            styles.badgePill,
            pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
          ]}
        >
          <View style={styles.glowDot} />
          <Text style={styles.badgeText}>
            made by : <Text style={styles.badgeAuthor}>om</Text>
          </Text>
          <Ionicons
            name="logo-instagram"
            size={12}
            color={GlassColors.cyan}
            style={{ marginLeft: 3 }}
          />
        </Pressable>
      </View>

      {/* ── EXPANDED MODAL POPUP ───────────────────────────────── */}
      <Modal
        visible={expanded}
        transparent
        animationType="none"
        onRequestClose={() => setExpanded(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setExpanded(false)}
        >
          <Animated.View
            style={[
              styles.cardModal,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={styles.cardInner}
            >
              {/* Close Button */}
              <Pressable
                onPress={() => setExpanded(false)}
                hitSlop={12}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={GlassColors.textMuted} />
              </Pressable>

              {/* Developer Avatar */}
              <View style={styles.avatarRing}>
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarEmoji}>👨‍💻</Text>
                </View>
              </View>

              {/* Full Name */}
              <Text style={styles.titleSmall}>CREATOR & DEVELOPER</Text>
              <Text style={styles.fullName}>Omkumar Ingalkar</Text>
              <Text style={styles.tagline}>
                Crafted with passion for campus students
              </Text>

              {/* Instagram Action Button */}
              <Pressable
                onPress={handleOpenInstagram}
                style={({ pressed }) => [
                  styles.instaButton,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={styles.instaIconWrap}>
                  <Ionicons name="logo-instagram" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.instaTextGroup}>
                  <Text style={styles.instaBtnTitle}>Follow on Instagram</Text>
                  <Text style={styles.instaBtnHandle}>@omkumaringalkar</Text>
                </View>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={GlassColors.cyan}
                  style={{ marginLeft: 'auto' }}
                />
              </Pressable>

              {/* Dismiss tip */}
              <Text style={styles.dismissTip}>Tap anywhere outside to close</Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    zIndex: 9999,
    elevation: 9999,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 14, 30, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(0, 229, 255, 0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 0 14px rgba(0, 229, 255, 0.25)',
        cursor: 'pointer',
      } as any,
      default: {
        shadowColor: GlassColors.cyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GlassColors.cyan,
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px #00E5FF',
      } as any,
    }),
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  badgeAuthor: {
    color: GlassColors.cyan,
    fontWeight: '900',
    letterSpacing: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 18, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      } as any,
    }),
  },
  cardModal: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.45)',
    backgroundColor: 'rgba(10, 18, 38, 0.95)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 0 35px rgba(0, 229, 255, 0.35)',
      } as any,
      default: {
        shadowColor: GlassColors.cyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 20,
        elevation: 12,
      },
    }),
  },
  cardInner: {
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderWidth: 2,
    borderColor: GlassColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
      } as any,
    }),
  },
  avatarInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  titleSmall: {
    fontSize: 10,
    fontWeight: '800',
    color: GlassColors.cyan,
    letterSpacing: 2,
    marginBottom: 4,
  },
  fullName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 12,
    color: GlassColors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  instaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        boxShadow: '0 0 16px rgba(0, 229, 255, 0.25)',
      } as any,
    }),
  },
  instaIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E1306C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instaTextGroup: {
    justifyContent: 'center',
  },
  instaBtnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  instaBtnHandle: {
    fontSize: 11,
    color: GlassColors.cyan,
    fontWeight: '700',
    marginTop: 1,
  },
  dismissTip: {
    fontSize: 10,
    color: GlassColors.textDim,
    marginTop: 14,
  },
});

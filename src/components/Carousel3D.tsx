import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { GlassColors } from '@/theme/glass-theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Carousel3DItem {
  id: string;
  code?: string;
  name?: string;
  label?: string;
  sublabel?: string;
  emoji?: string;
  color?: string;
}

interface Carousel3DProps<T extends Carousel3DItem> {
  data: T[];
  selectedId: string;
  onSelect: (item: T) => void;
  cardWidth?: number;
  cardHeight?: number;
  type?: 'branch' | 'division' | 'batch';
}

export function Carousel3D<T extends Carousel3DItem>({
  data,
  selectedId,
  onSelect,
  cardWidth = 110,
  cardHeight = 140,
  type = 'branch',
}: Carousel3DProps<T>) {
  const scrollRef = useRef<ScrollView>(null);
  const cardGap = 16;
  const itemFullWidth = cardWidth + cardGap;
  const spacerWidth = (SCREEN_WIDTH - cardWidth) / 2;

  // Center selected item when selectedId changes or on initial render
  useEffect(() => {
    const index = data.findIndex((d) => d.id === selectedId);
    if (index !== -1) {
      const targetOffset = index * itemFullWidth;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: targetOffset, animated: true });
      }, 80);
    }
  }, [selectedId, data.length]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemFullWidth);
    if (index >= 0 && index < data.length) {
      const target = data[index];
      if (target && target.id !== selectedId) {
        onSelect(target);
      }
    }
  };

  const handleItemPress = (item: T, index: number) => {
    onSelect(item);
    const targetOffset = index * itemFullWidth;
    scrollRef.current?.scrollTo({ x: targetOffset, animated: true });
  };

  return (
    <View style={[styles.container, { height: cardHeight + 50 }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemFullWidth}
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={[
          styles.scrollTrack,
          {
            paddingLeft: spacerWidth,
            paddingRight: spacerWidth,
          },
        ]}
      >
        {data.map((item, index) => {
          const isSelected = item.id === selectedId;
          const displayCode = item.code || item.label || item.id;
          const displayName = item.name || item.sublabel || '';

          return (
            <CardItem
              key={item.id}
              item={item}
              displayCode={displayCode}
              displayName={displayName}
              isSelected={isSelected}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              cardGap={cardGap}
              type={type}
              onPress={() => handleItemPress(item, index)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function CardItem({
  item,
  displayCode,
  displayName,
  isSelected,
  cardWidth,
  cardHeight,
  cardGap,
  type,
  onPress,
}: {
  item: any;
  displayCode: string;
  displayName: string;
  isSelected: boolean;
  cardWidth: number;
  cardHeight: number;
  cardGap: number;
  type: 'branch' | 'division' | 'batch';
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(isSelected ? 1.18 : 0.88)).current;
  const glowOpacity = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isSelected ? 1.18 : 0.88,
        tension: 70,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: isSelected ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelected]);

  const getCodeFontSize = () => {
    if (type === 'division') return 44;
    if (type === 'batch') return 40;
    return displayCode.length > 4 ? 20 : 26;
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.pressableWrap, { width: cardWidth, marginHorizontal: cardGap / 2 }]}
    >
      <Animated.View
        style={[
          styles.glassCard3D,
          {
            width: cardWidth,
            height: cardHeight,
            transform: [{ scale }],
            borderColor: isSelected ? GlassColors.cyan : 'rgba(0, 229, 255, 0.22)',
            borderWidth: isSelected ? 2.5 : 1.5,
            backgroundColor: isSelected
              ? 'rgba(0, 229, 255, 0.12)'
              : 'rgba(9, 15, 33, 0.65)',
            ...Platform.select({
              web: {
                boxShadow: isSelected
                  ? '0 0 32px rgba(0, 229, 255, 0.75), inset 0 0 16px rgba(0, 229, 255, 0.22)'
                  : 'none',
                cursor: 'pointer',
              } as any,
              default: {
                shadowColor: GlassColors.cyan,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isSelected ? 0.95 : 0,
                shadowRadius: isSelected ? 22 : 0,
                elevation: isSelected ? 14 : 0,
              },
            }),
          },
        ]}
      >
        {/* Glow halo element */}
        {isSelected && (
          <View style={styles.glowHalo} pointerEvents="none" />
        )}

        {/* Optional Emoji / Icon */}
        {item.emoji && (
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
        )}

        {/* Large Code / Letter / Number */}
        <Text
          style={[
            styles.codeText,
            {
              fontSize: getCodeFontSize(),
              color: isSelected ? GlassColors.cyan : 'rgba(255, 255, 255, 0.55)',
              fontWeight: isSelected ? '900' : '700',
              ...Platform.select({
                web: {
                  textShadow: isSelected ? '0 0 16px rgba(0, 229, 255, 0.9)' : 'none',
                } as any,
              }),
            },
          ]}
        >
          {displayCode}
        </Text>

        {/* Subtitle / Full name */}
        {displayName ? (
          <Text
            numberOfLines={2}
            style={[
              styles.nameText,
              {
                color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                fontWeight: isSelected ? '700' : '500',
              },
            ]}
          >
            {displayName}
          </Text>
        ) : null}

        {/* Selected badge */}
        {isSelected && (
          <View style={styles.selectedPill}>
            <Text style={styles.selectedPillText}>SELECTED</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollTrack: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  pressableWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCard3D: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      } as any,
    }),
  },
  glowHalo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  cardEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  codeText: {
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  nameText: {
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 13,
    paddingHorizontal: 4,
  },
  selectedPill: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  selectedPillText: {
    fontSize: 8,
    fontWeight: '900',
    color: GlassColors.cyan,
    letterSpacing: 1.5,
  },
});

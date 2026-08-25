import { useEffect, useMemo } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { colors, images } from '@/constants'
import posters from '@/constants/posters'
import CustomButton from '@/components/customButton'

// Preserved (jest snapshot imports this).
export function AppName({ children }) {
  return <Text style={{ color: colors.secondary[200] }}>{children}</Text>
}

const POSTER_WIDTH = 110
const POSTER_HEIGHT = 165
const POSTER_GAP = 12
const ROW_WIDTH = posters.length * (POSTER_WIDTH + POSTER_GAP)
// Base marquee loop duration. Row 2 uses ~1.55x for parallax speed differential.
const SCROLL_DURATION = 65000
// Slow Ken-Burns zoom cycle on the blurred backdrop.
const BACKDROP_KEN_BURNS_DURATION = 22000
const BACKDROP_KEN_BURNS_MAX_SCALE = 1.15

// Which bundled poster to use as the blurred hero backdrop.
// Blade Runner 2049 has the strong orange/teal palette that matches our accents.
const BACKDROP_SOURCE = posters[8]

const PosterRow = ({ direction = 'left', speed = 1 }) => {
  const start = direction === 'left' ? 0 : -ROW_WIDTH
  const end = direction === 'left' ? -ROW_WIDTH : 0
  const translate = useSharedValue(start)

  useEffect(() => {
    translate.value = start
    translate.value = withRepeat(
      withTiming(end, {
        duration: SCROLL_DURATION / speed,
        easing: Easing.linear,
      }),
      -1,
      false,
    )
    return () => cancelAnimation(translate)
  }, [direction, speed, start, end, translate])

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translate.value }],
  }))

  const items = useMemo(() => [...posters, ...posters], [])
  const orderedItems = direction === 'left' ? items : [...items].reverse()

  return (
    <View style={styles.rowClip} pointerEvents="none">
      <Animated.View style={[styles.row, rowStyle]}>
        {orderedItems.map((src, i) => (
          <Image
            key={`${direction}-${i}`}
            source={src}
            style={styles.poster}
            resizeMode="cover"
          />
        ))}
      </Animated.View>
    </View>
  )
}

const RootIndex = () => {
  // Ken Burns: slow scale in/out on the blurred backdrop for a cinematic
  // "moving still" feel. Provides the parallax-like motion without scroll.
  const backdropScale = useSharedValue(1)
  useEffect(() => {
    backdropScale.value = withRepeat(
      withTiming(BACKDROP_KEN_BURNS_MAX_SCALE, {
        duration: BACKDROP_KEN_BURNS_DURATION,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true, // reverse each iteration so it breathes in/out
    )
    return () => cancelAnimation(backdropScale)
  }, [backdropScale])

  const backdropStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backdropScale.value }],
  }))

  return (
    <View style={styles.root}>
      {/* Blurred backdrop with Ken Burns zoom */}
      <View style={styles.backdropWrap} pointerEvents="none">
        <Animated.Image
          source={BACKDROP_SOURCE}
          style={[styles.backdrop, backdropStyle]}
          blurRadius={40}
          resizeMode="cover"
        />
        <View style={styles.backdropDarken} />
        <View style={styles.backdropGradient} />
      </View>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.brandRow}>
          <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.marqueeArea} pointerEvents="none">
          {/* Row 1 slides left at base speed. Row 2 slides right at ~65% speed —
              speed differential creates a parallax-of-depth feel. */}
          <PosterRow direction="left" speed={1} />
          <View style={{ height: POSTER_GAP }} />
          <PosterRow direction="right" speed={0.65} />
        </View>

        <View style={styles.spacer} />

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>MovieMania</Text>
          <Text style={styles.h1}>
            Discover movies{'\n'}worth your time.
          </Text>
          <Text style={styles.subtitle}>
            Search a vast catalog, save what catches your eye, and never lose track of the next
            film on your list.
          </Text>
        </View>

        <View style={styles.actions}>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/(auth)')}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backdropWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  backdrop: {
    position: 'absolute',
    top: -80,
    left: -80,
    right: -80,
    bottom: -80,
    width: undefined,
    height: undefined,
  },
  backdropDarken: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.55,
  },
  backdropGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    experimental_backgroundImage: `linear-gradient(to bottom, rgba(20, 24, 28, 0) 0%, rgba(20, 24, 28, 0.85) 55%, ${colors.primary} 100%)`,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  brandRow: {
    paddingTop: 8,
    alignItems: 'flex-start',
  },
  logo: {
    width: 140,
    height: 40,
  },
  // Marquee extends beyond the safe-area horizontal padding for edge-to-edge scroll.
  marqueeArea: {
    marginTop: 20,
    marginHorizontal: -24,
    overflow: 'hidden',
  },
  rowClip: {
    overflow: 'hidden',
    height: POSTER_HEIGHT,
  },
  row: {
    flexDirection: 'row',
    gap: POSTER_GAP,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  hero: {
    marginBottom: 24,
  },
  eyebrow: {
    color: colors.accent.orange,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  h1: {
    color: colors.text.DEFAULT,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -0.8,
    marginBottom: 14,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    paddingBottom: 8,
  },
})

export default RootIndex

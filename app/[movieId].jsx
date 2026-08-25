import { useEffect, useState } from 'react'
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { fetchSelectedMovie } from '../api/fetchData'
import { colors } from '../constants'
import useMoviesStore from '../store/moviesStore'

const DEFAULT_POSTER =
  'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg'

const HERO_HEIGHT = 380
const BACKDROP_OVERFLOW = 220 // extra image outside the visible hero, gives room for parallax + stretch
const MAX_PULL_SCALE = 1.8

const SelectedMovie = () => {
  const { id } = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const scrollY = useSharedValue(0)

  const { data, status, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchSelectedMovie(String(id)),
    enabled: Boolean(id),
  })

  const addMovies = useMoviesStore((s) => s.addMovies)
  const removeMovie = useMoviesStore((s) => s.removeMovie)
  const checkMovie = useMoviesStore((s) => s.checkMovie)
  const [isPresent, setIsPresent] = useState(false)

  useEffect(() => {
    if (data?.Response === 'True') {
      setIsPresent(checkMovie(data))
    } else {
      setIsPresent(false)
    }
  }, [data, checkMovie])

  const handleToggleWatchlist = () => {
    if (data?.Response !== 'True') return
    if (isPresent) {
      removeMovie(data)
      setIsPresent(false)
    } else {
      addMovies(data)
      setIsPresent(true)
    }
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y
    },
  })

  // Parallax + top-anchored pull stretch computed on the UI thread.
  const backdropStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-HERO_HEIGHT, 0, HERO_HEIGHT],
      [
        (HERO_HEIGHT * (MAX_PULL_SCALE - 1)) / 2, // anchor top under max pull-stretch
        0,
        -HERO_HEIGHT * 0.3, // parallax up on scroll
      ],
      Extrapolation.EXTEND,
    )
    const scale = interpolate(
      scrollY.value,
      [-HERO_HEIGHT, 0],
      [MAX_PULL_SCALE, 1],
      { extrapolateLeft: Extrapolation.EXTEND, extrapolateRight: Extrapolation.CLAMP },
    )
    return { transform: [{ translateY }, { scale }] }
  })

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FloatingBackButton topInset={insets.top} />

      {status === 'pending' ? (
        <MovieDetailSkeleton />
      ) : status === 'error' ? (
        <ErrorState
          title="Couldn't load movie"
          subtitle={error?.message ?? 'Try again in a moment.'}
        />
      ) : data?.Response === 'False' ? (
        <ErrorState title="Movie not found" subtitle={data?.Error ?? 'Unknown id.'} />
      ) : (
        <MovieContent
          data={data}
          insets={insets}
          scrollHandler={scrollHandler}
          backdropStyle={backdropStyle}
          isPresent={isPresent}
          onToggle={handleToggleWatchlist}
        />
      )}
    </View>
  )
}

const MovieContent = ({
  data,
  insets,
  scrollHandler,
  backdropStyle,
  isPresent,
  onToggle,
}) => {
  const poster = data.Poster === 'N/A' ? DEFAULT_POSTER : data.Poster
  const genres = (data.Genre ?? '').split(',').map((g) => g.trim()).filter(Boolean)
  const type = data.Type ? data.Type[0].toUpperCase() + data.Type.slice(1) : null

  return (
    <>
      <View pointerEvents="none" style={styles.heroClip}>
        <Animated.Image
          source={{ uri: poster }}
          resizeMode="cover"
          blurRadius={30}
          style={[styles.backdrop, backdropStyle]}
        />
        <View style={styles.backdropDarken} />
        <View style={styles.backdropGradient} />
      </View>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 48 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      >
        <View style={[styles.heroSpacer, { height: HERO_HEIGHT - 140 }]} />

        <View style={styles.headerRow}>
          <Image source={{ uri: poster }} style={styles.poster} resizeMode="cover" />
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={3}>
              {data.Title}
            </Text>
            <View style={styles.metaRow}>
              {data.Year ? <Text style={styles.metaText}>{data.Year}</Text> : null}
              {data.Runtime && data.Runtime !== 'N/A' ? (
                <>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>{data.Runtime}</Text>
                </>
              ) : null}
              {type ? (
                <>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaType}>{type}</Text>
                </>
              ) : null}
            </View>
            {data.imdbRating && data.imdbRating !== 'N/A' ? (
              <View style={styles.ratingPill}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingValue}>{data.imdbRating}</Text>
                <Text style={styles.ratingScale}>/ 10</Text>
                <Text style={styles.ratingSource}>IMDb</Text>
              </View>
            ) : null}
          </View>
        </View>

        {genres.length > 0 ? (
          <View style={styles.chipsRow}>
            {genres.map((g) => (
              <View key={g} style={styles.chip}>
                <Text style={styles.chipText}>{g}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {data.Plot && data.Plot !== 'N/A' ? (
          <Section title="Plot" body={data.Plot} plot />
        ) : null}
        {data.Director && data.Director !== 'N/A' ? (
          <Section title="Director" body={data.Director} />
        ) : null}
        {data.Actors && data.Actors !== 'N/A' ? (
          <Section title="Cast" body={data.Actors} />
        ) : null}
        {data.Released && data.Released !== 'N/A' ? (
          <Section title="Released" body={data.Released} />
        ) : null}

        <Pressable
          onPress={onToggle}
          style={({ pressed }) => [
            styles.actionBtn,
            isPresent && styles.actionBtnAdded,
            pressed && styles.actionBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            isPresent ? 'Remove from Watchlist' : 'Add to Watchlist'
          }
        >
          <Text style={[styles.actionBtnText, isPresent && styles.actionBtnTextAdded]}>
            {isPresent ? '✓ In Watchlist  ·  Tap to remove' : '+ Add to Watchlist'}
          </Text>
        </Pressable>
      </Animated.ScrollView>
    </>
  )
}

const Section = ({ title, body, plot }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={plot ? styles.plot : styles.sectionBody}>{body}</Text>
  </View>
)

const FloatingBackButton = ({ topInset }) => (
  <Pressable
    onPress={() => router.back()}
    hitSlop={12}
    style={({ pressed }) => [
      styles.backBtn,
      { top: topInset + 8 },
      pressed && { opacity: 0.6 },
    ]}
    accessibilityRole="button"
    accessibilityLabel="Back"
  >
    <Text style={styles.backChevron}>‹</Text>
  </Pressable>
)

const MovieDetailSkeleton = () => (
  <View style={styles.root}>
    <View style={styles.heroClip}>
      <View style={[styles.backdrop, styles.skeletonBg]} />
      <View style={styles.backdropDarken} />
      <View style={styles.backdropGradient} />
    </View>
    <View style={{ height: HERO_HEIGHT - 140 }} />
    <View style={styles.headerRow}>
      <View style={[styles.poster, styles.skeletonBg]} />
      <View style={styles.headerText}>
        <View style={[styles.skeletonLine, { width: '80%', height: 22 }]} />
        <View style={[styles.skeletonLine, { width: '55%', height: 14, marginTop: 12 }]} />
        <View style={[styles.skeletonLine, { width: '40%', height: 28, marginTop: 12, borderRadius: 14 }]} />
      </View>
    </View>
    <View style={styles.chipsRow}>
      {[80, 100, 70].map((w, i) => (
        <View key={i} style={[styles.skeletonLine, { width: w, height: 26, borderRadius: 13 }]} />
      ))}
    </View>
    <View style={styles.section}>
      <View style={[styles.skeletonLine, { width: 60, height: 16 }]} />
      <View style={[styles.skeletonLine, { width: '100%', height: 12, marginTop: 12 }]} />
      <View style={[styles.skeletonLine, { width: '95%', height: 12, marginTop: 8 }]} />
      <View style={[styles.skeletonLine, { width: '90%', height: 12, marginTop: 8 }]} />
      <View style={[styles.skeletonLine, { width: '60%', height: 12, marginTop: 8 }]} />
    </View>
  </View>
)

const ErrorState = ({ title, subtitle }) => (
  <View style={[styles.root, styles.errorContainer]}>
    <Text style={styles.errorTitle}>{title}</Text>
    <Text style={styles.errorSubtitle}>{subtitle}</Text>
  </View>
)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  heroClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  backdrop: {
    position: 'absolute',
    top: -BACKDROP_OVERFLOW / 2,
    left: 0,
    right: 0,
    height: HERO_HEIGHT + BACKDROP_OVERFLOW,
  },
  backdropDarken: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.35,
  },
  backdropGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HERO_HEIGHT,
    experimental_backgroundImage: `linear-gradient(to bottom, rgba(20, 24, 28, 0) 0%, rgba(20, 24, 28, 0.6) 55%, ${colors.primary} 100%)`,
  },
  heroSpacer: {
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  poster: {
    width: 130,
    height: 195,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerText: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
    color: colors.text.DEFAULT,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  metaText: {
    color: colors.text.muted,
    fontSize: 13,
  },
  metaDot: {
    color: colors.text.dim,
    fontSize: 13,
  },
  metaType: {
    color: colors.accent.orange,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.accent.amber,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 12,
  },
  ratingStar: {
    color: colors.accent.amber,
    fontSize: 12,
  },
  ratingValue: {
    color: colors.text.DEFAULT,
    fontSize: 13,
    fontWeight: '700',
  },
  ratingScale: {
    color: colors.text.dim,
    fontSize: 11,
  },
  ratingSource: {
    color: colors.text.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 13,
  },
  chipText: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text.dim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  sectionBody: {
    color: colors.text.DEFAULT,
    fontSize: 15,
    lineHeight: 22,
  },
  plot: {
    color: colors.text.DEFAULT,
    fontSize: 15,
    lineHeight: 23,
  },
  actionBtn: {
    marginHorizontal: 20,
    marginTop: 12,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    opacity: 0.8,
  },
  actionBtnAdded: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent.green,
  },
  actionBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  actionBtnTextAdded: {
    color: colors.accent.green,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 24, 28, 0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: {
    color: colors.text.DEFAULT,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
    marginTop: -2,
    marginLeft: -2,
  },
  skeletonBg: {
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  skeletonLine: {
    backgroundColor: colors.surface,
    borderRadius: 4,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    color: colors.text.DEFAULT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorSubtitle: {
    color: colors.text.muted,
    fontSize: 14,
    textAlign: 'center',
  },
})

export default SelectedMovie

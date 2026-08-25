import React, { useEffect, useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { fetchSelectedMovie } from '../api/fetchData'
import { colors } from '../constants'
import useMoviesStore from '../store/moviesStore'

const DEFAULT_POSTER =
  'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg'

const HERO_HEIGHT = 320

const SelectedMovie = () => {
  const { id } = useLocalSearchParams()

  const { data, status, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchSelectedMovie(String(id)),
    enabled: Boolean(id),
  })

  const addMovies = useMoviesStore((s) => s.addMovies)
  const checkMovie = useMoviesStore((s) => s.checkMovie)
  const [isPresent, setIsPresent] = useState(false)

  useEffect(() => {
    if (data?.Response === 'True') {
      setIsPresent(checkMovie(data))
    } else {
      setIsPresent(false)
    }
  }, [data, checkMovie])

  const handleAddMovie = () => {
    if (!isPresent && data?.Response === 'True') {
      addMovies(data)
      setIsPresent(true)
    }
  }

  if (status === 'pending') return <MovieDetailSkeleton />
  if (status === 'error') {
    return (
      <ErrorState
        title="Couldn't load movie"
        subtitle={error?.message ?? 'Try again in a moment.'}
      />
    )
  }
  if (data?.Response === 'False') {
    return (
      <ErrorState title="Movie not found" subtitle={data?.Error ?? 'Unknown id.'} />
    )
  }

  const poster = data.Poster === 'N/A' ? DEFAULT_POSTER : data.Poster
  const genres = (data.Genre ?? '').split(',').map((g) => g.trim()).filter(Boolean)
  const type = data.Type ? data.Type[0].toUpperCase() + data.Type.slice(1) : null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Image
          source={{ uri: poster }}
          style={styles.backdrop}
          resizeMode="cover"
          blurRadius={20}
        />
        <View style={styles.backdropOverlay} />
      </View>

      <View style={styles.headerRow}>
        <Image
          source={{ uri: poster }}
          style={styles.poster}
          resizeMode="cover"
        />
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plot</Text>
          <Text style={styles.plot}>{data.Plot}</Text>
        </View>
      ) : null}

      {data.Director && data.Director !== 'N/A' ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Director</Text>
          <Text style={styles.sectionBody}>{data.Director}</Text>
        </View>
      ) : null}

      {data.Actors && data.Actors !== 'N/A' ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cast</Text>
          <Text style={styles.sectionBody}>{data.Actors}</Text>
        </View>
      ) : null}

      {data.Released && data.Released !== 'N/A' ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Released</Text>
          <Text style={styles.sectionBody}>{data.Released}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleAddMovie}
        disabled={isPresent}
        style={({ pressed }) => [
          styles.actionBtn,
          isPresent && styles.actionBtnAdded,
          pressed && !isPresent && styles.actionBtnPressed,
        ]}
      >
        <Text style={[styles.actionBtnText, isPresent && styles.actionBtnTextAdded]}>
          {isPresent ? '✓ In your Watchlist' : '+ Add to Watchlist'}
        </Text>
      </Pressable>
    </ScrollView>
  )
}

const MovieDetailSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.hero}>
      <View style={[styles.backdrop, styles.skeletonBg]} />
      <View style={styles.backdropOverlay} />
    </View>
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
        <View
          key={i}
          style={[styles.skeletonLine, { width: w, height: 26, borderRadius: 13 }]}
        />
      ))}
    </View>
    <View style={styles.section}>
      <View style={[styles.skeletonLine, { width: 60, height: 16 }]} />
      <View style={[styles.skeletonLine, { width: '100%', height: 12, marginTop: 12 }]} />
      <View style={[styles.skeletonLine, { width: '95%', height: 12, marginTop: 8 }]} />
      <View style={[styles.skeletonLine, { width: '90%', height: 12, marginTop: 8 }]} />
      <View style={[styles.skeletonLine, { width: '60%', height: 12, marginTop: 8 }]} />
    </View>
    <View style={styles.section}>
      <View style={[styles.skeletonLine, { width: 80, height: 16 }]} />
      <View style={[styles.skeletonLine, { width: '70%', height: 12, marginTop: 12 }]} />
    </View>
  </View>
)

const ErrorState = ({ title, subtitle }) => (
  <View style={[styles.container, styles.errorContainer]}>
    <Text style={styles.errorTitle}>{title}</Text>
    <Text style={styles.errorSubtitle}>{subtitle}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    height: HERO_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backdrop: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.55,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: HERO_HEIGHT - 190,
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

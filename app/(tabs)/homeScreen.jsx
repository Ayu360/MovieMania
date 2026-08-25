import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { router } from 'expo-router'

import SearchBar from '../../components/searchBar'
import PosterTile from '../../components/flatlist'
import { fetchMovies } from '../../api/fetchData'
import { colors, icons } from '../../constants'
import useAuthStore from '../../store/authStore'

const OMDB_PAGE_SIZE = 10
const SKELETON_COUNT = 6
const GRID_GUTTER = 12

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [movieName, setMovieName] = useState('batman')
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false })
    router.dismissAll('/')
  }

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['movies', movieName],
    queryFn: ({ pageParam }) => fetchMovies(`s=${encodeURIComponent(movieName)}`, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.Response !== 'True') return undefined
      const loaded = allPages.reduce((sum, p) => sum + (p.Search?.length ?? 0), 0)
      const total = Number(lastPage.totalResults ?? 0)
      return loaded < total ? allPages.length + 1 : undefined
    },
    enabled: movieName.length > 0,
    placeholderData: keepPreviousData,
  })

  const movies = useMemo(
    () => data?.pages?.flatMap((p) => p.Search ?? []) ?? [],
    [data],
  )
  const totalResults = Number(data?.pages?.[0]?.totalResults ?? 0)
  const firstPage = data?.pages?.[0]
  const isEmpty = status === 'success' && firstPage?.Response === 'False'

  const handleSubmit = () => {
    const trimmed = searchQuery.trim()
    if (trimmed.length > 0) setMovieName(trimmed)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroTitleWrap}>
            <Text style={styles.h1}>Discover</Text>
            <Text style={styles.subtitle}>Find your next movie</Text>
          </View>
          <Pressable
            onPress={handleLogout}
            hitSlop={12}
            style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Image source={icons.logout} style={styles.logoutIcon} resizeMode="contain" />
          </Pressable>
        </View>
        <View style={styles.searchWrap}>
          <SearchBar
            value={searchQuery}
            handleChangeText={setSearchQuery}
            handleSubmit={handleSubmit}
          />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Results</Text>
          {totalResults > 0 ? (
            <Text style={styles.countChip}>{totalResults} found</Text>
          ) : null}
        </View>
      </View>

      {status === 'pending' ? (
        <SkeletonGrid />
      ) : status === 'error' ? (
        <EmptyState
          title="Something went wrong"
          subtitle={error?.message ?? 'Try again in a moment.'}
        />
      ) : isEmpty ? (
        <EmptyState
          title="No results"
          subtitle={`Nothing matched “${movieName}”. Try another title.`}
        />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, idx) => `${item.imdbID}-${idx}`}
          renderItem={({ item }) => <PosterTile item={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage()
          }}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.text.muted} />
              </View>
            ) : hasNextPage ? null : movies.length > 0 ? (
              <Text style={styles.footerEnd}>You've reached the end</Text>
            ) : null
          }
          refreshing={isFetching && !isFetchingNextPage && movies.length > 0}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const SkeletonGrid = () => (
  <View style={[styles.grid, styles.skeletonGrid]}>
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <View key={i} style={styles.skeletonCell}>
        <View style={styles.skeletonPoster} />
        <View style={styles.skeletonLineLg} />
        <View style={styles.skeletonLineSm} />
      </View>
    ))}
  </View>
)

const EmptyState = ({ title, subtitle }) => (
  <View style={styles.empty}>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptySubtitle}>{subtitle}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  hero: {
    paddingHorizontal: GRID_GUTTER,
    paddingTop: 8,
    paddingBottom: 4,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroTitleWrap: {
    flex: 1,
  },
  h1: {
    color: colors.text.DEFAULT,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: 14,
    marginTop: 2,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  logoutIcon: {
    width: 18,
    height: 18,
    tintColor: colors.text.muted,
  },
  searchWrap: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text.DEFAULT,
    fontSize: 18,
    fontWeight: '700',
  },
  countChip: {
    color: colors.accent.orange,
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    paddingHorizontal: GRID_GUTTER,
    paddingBottom: 24,
  },
  row: {
    gap: GRID_GUTTER,
    marginBottom: 20,
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerEnd: {
    color: colors.text.dim,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: colors.text.DEFAULT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: colors.text.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GUTTER,
  },
  skeletonCell: {
    width: `${(100 - 4) / 2}%`,
  },
  skeletonPoster: {
    aspectRatio: 2 / 3,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  skeletonLineLg: {
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.surface,
    marginTop: 10,
    width: '80%',
  },
  skeletonLineSm: {
    height: 10,
    borderRadius: 4,
    backgroundColor: colors.surface,
    marginTop: 6,
    width: '40%',
  },
})

export default Home

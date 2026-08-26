import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import PosterTile from '@/components/PosterTile';
import useMoviesStore from '@/store/moviesStore';
import { colors } from '@/constants';

const GRID_GUTTER = 12;

const Favorites = () => {
  const movies = useMoviesStore((s) => s.movies);
  const clearAllMovies = useMoviesStore((s) => s.clearAllMovies);
  const insets = useSafeAreaInsets();
  const listBottomPad = 56 + (insets.bottom || 12) + 20;

  const isEmpty = movies.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroTitleWrap}>
            <Text style={styles.h1}>Watchlist</Text>
            <Text style={styles.subtitle}>
              {isEmpty
                ? 'Movies you save will appear here'
                : `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'} saved`}
            </Text>
          </View>
          {isEmpty ? null : (
            <Pressable
              onPress={clearAllMovies}
              hitSlop={8}
              style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.6 }]}
              accessibilityRole="button"
              accessibilityLabel="Clear all saved movies"
            >
              <Text style={styles.clearBtnText}>Clear all</Text>
            </Pressable>
          )}
        </View>
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>Your Watchlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Find a movie on Discover, open it, and tap{'\n'}
            <Text style={styles.emptyAccent}>+ Add to Watchlist</Text> to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => <PosterTile item={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.grid, { paddingBottom: listBottomPad }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  hero: {
    paddingHorizontal: GRID_GUTTER,
    paddingTop: 8,
    paddingBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
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
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginTop: 8,
  },
  clearBtnText: {
    color: colors.text.muted,
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: colors.text.DEFAULT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.text.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyAccent: {
    color: colors.accent.orange,
    fontWeight: '600',
  },
});

export default Favorites;

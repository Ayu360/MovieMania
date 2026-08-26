import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors } from '@/constants';
import type { MovieType, SearchResult } from '@/types/omdb';
import type { SavedMovie } from '@/store/moviesStore';

const DEFAULT_POSTER =
  'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg';

const TYPE_LABEL: Record<MovieType, string> = {
  movie: 'Movie',
  series: 'Series',
  episode: 'Episode',
  game: 'Game',
};

type Props = {
  item: SearchResult | SavedMovie;
};

const PosterTile = ({ item }: Props) => {
  const poster = !item.Poster || item.Poster === 'N/A' ? DEFAULT_POSTER : item.Poster;
  const type = TYPE_LABEL[item.Type] ?? item.Type;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => router.navigate({ pathname: '/[id]', params: { id: item.imdbID } })}
    >
      <View style={styles.posterWrap}>
        <Image source={{ uri: poster }} style={styles.poster} resizeMode="cover" />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.Title}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.year}>{item.Year}</Text>
        {type ? (
          <>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.type}>{type}</Text>
          </>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.7,
  },
  posterWrap: {
    aspectRatio: 2 / 3,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginTop: 8,
    color: colors.text.DEFAULT,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  year: {
    color: colors.text.muted,
    fontSize: 12,
  },
  dot: {
    color: colors.text.dim,
    fontSize: 12,
  },
  type: {
    color: colors.accent.orange,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

export default PosterTile;

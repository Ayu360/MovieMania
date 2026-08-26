import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { MovieDetail, SearchResult } from '@/types/omdb';

export type SavedMovie = MovieDetail | SearchResult;

type MoviesState = {
  movies: SavedMovie[];
  addMovies: (movie: SavedMovie) => void;
  removeMovie: (movie: Pick<SavedMovie, 'imdbID'>) => void;
  clearAllMovies: () => void;
  checkMovie: (movie: Pick<SavedMovie, 'imdbID'>) => boolean;
};

const useMoviesStore = create<MoviesState>()(
  persist(
    (set, get) => ({
      movies: [],
      addMovies: (movie) =>
        set((state) =>
          state.movies.some((m) => m.imdbID === movie.imdbID)
            ? state
            : { movies: [...state.movies, movie] },
        ),
      removeMovie: (movie) =>
        set((state) => ({
          movies: state.movies.filter((m) => m.imdbID !== movie.imdbID),
        })),
      clearAllMovies: () => set({ movies: [] }),
      checkMovie: (movie) => get().movies.some((m) => m.imdbID === movie.imdbID),
    }),
    {
      name: 'moviemania.watchlist',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ movies: state.movies }),
    },
  ),
);

export default useMoviesStore;

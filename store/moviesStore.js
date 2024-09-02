import { create } from "zustand";

const useMoviesStore = create((set, get) => ({
  movies: [],
  paginatedMovies: [],
  items: 0,
  addMovies: (movie) =>
    set((state) => {
      state.items++;
      const hasMovie = state.movies.find((m) => m.imdbID === movie.imdbID);

      if (hasMovie) {
        return {
          movies: state.movies,
          paginatedMovies: state.paginatedMovies,
        };
      } else {
        let newPaginatedMovies = state.paginatedMovies;
        if (state.items <= 5) {
          state.lastIdx++;
          newPaginatedMovies = [...newPaginatedMovies, movie];
        }
        return {
          movies: [...state.movies, movie],
          paginatedMovies: newPaginatedMovies,
        };
      }
    }),
  removeMovie: (movie) =>
    set((state) => {
      state.items--;
      return {
        movies: state.movies.filter((m) => m.imdbID !== movie.imdbID),
      };
    }),
  clearAllMovies: () =>
    set(() => {
      return {
        movies: [],
        items: 0,
      };
    }),
  checkMovie: (movie) => {
    const moviesData = get().movies;
    const hasMovie = moviesData.find((m) => m.imdbID === movie.imdbID);
    if (hasMovie) return true;
    return false;
  },
  getMovies: (initial, final) => {
    set((state) => {
      return {
        paginatedMovies: state.movies.slice(initial, final),
      };
    });
  },
}));

export default useMoviesStore;

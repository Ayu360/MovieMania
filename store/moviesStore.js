import { create } from 'zustand'

const useMoviesStore = create((set, get) => ({
  movies: [],
  addMovies: (movie) =>
    set((state) => {
      if (state.movies.find((m) => m.imdbID === movie.imdbID)) return state
      return { movies: [...state.movies, movie] }
    }),
  removeMovie: (movie) =>
    set((state) => ({
      movies: state.movies.filter((m) => m.imdbID !== movie.imdbID),
    })),
  clearAllMovies: () => set({ movies: [] }),
  checkMovie: (movie) => Boolean(get().movies.find((m) => m.imdbID === movie.imdbID)),
}))

export default useMoviesStore

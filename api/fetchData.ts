import type { MovieDetailResponse, SearchResponse } from '@/types/omdb';

const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY ?? '10fd2219';
const OMDB_BASE = `https://omdbapi.com/?apikey=${API_KEY}`;

export async function fetchMovies(query: string, page = 1): Promise<SearchResponse> {
  const res = await fetch(`${OMDB_BASE}&${query}&page=${page}`);
  return (await res.json()) as SearchResponse;
}

export async function fetchSelectedMovie(id: string): Promise<MovieDetailResponse> {
  const res = await fetch(`${OMDB_BASE}&i=${id}`);
  return (await res.json()) as MovieDetailResponse;
}

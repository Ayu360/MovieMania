const OMDB_BASE = "https://omdbapi.com/?apikey=10fd2219";

export async function fetchMovies(query: string, page: number = 1) {
  const res = await fetch(`${OMDB_BASE}&${query}&page=${page}`);
  const result = await res.json();
  return result;
}

export async function fetchSelectedMovie(id: string) {
  const res = await fetch(`${OMDB_BASE}&i=${id}`);
  const data = await res.json();
  return data;
}

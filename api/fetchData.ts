export async function fetchMovies(query:string) {
  const res = await fetch(`https://omdbapi.com/?apikey=10fd2219&${query}`);
  const result = await res.json();
  return result;
}

export async function fetchSelectedMovie(id:string) {
  let res = await fetch(`https://omdbapi.com/?apikey=10fd2219&i=${id}`);
  let data = await res.json();
  return data;
}
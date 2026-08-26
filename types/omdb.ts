export type MovieType = 'movie' | 'series' | 'episode' | 'game';

export type SearchResult = {
  imdbID: string;
  Title: string;
  Year: string;
  Type: MovieType;
  Poster: string;
};

export type SearchSuccess = {
  Response: 'True';
  Search: SearchResult[];
  totalResults: string;
};

export type OmdbError = {
  Response: 'False';
  Error: string;
};

export type SearchResponse = SearchSuccess | OmdbError;

export type MovieDetail = {
  Response: 'True';
  imdbID: string;
  Title: string;
  Year: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster: string;
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Type: MovieType;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
};

export type MovieDetailResponse = MovieDetail | OmdbError;

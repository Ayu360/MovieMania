export type ResolvedRoute =
  | string
  | { pathname: string; params: Record<string, string> };

export function resolveRoute(
  data: Record<string, unknown> | null | undefined,
): ResolvedRoute {
  if (data) {
    if (typeof data.movieId === 'string' && data.movieId.length > 0) {
      return { pathname: '/[id]', params: { id: data.movieId } };
    }
    if (typeof data.route === 'string' && data.route.length > 0) {
      return data.route;
    }
  }
  return '/(tabs)/homeScreen';
}

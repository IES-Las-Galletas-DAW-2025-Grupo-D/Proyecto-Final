import { environment } from "../environments/environment";

/**
 * Constructs the full API URL for a given route.
 * @param route it may start with a slash
 * @returns
 */
export function toApiUrl(route: string): string {
  return `${environment.apiUrl}${route}`;
}

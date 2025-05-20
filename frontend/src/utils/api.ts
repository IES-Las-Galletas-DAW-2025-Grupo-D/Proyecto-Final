import { environment } from "../environments/environment";

/**
 * Constructs the full API URL for a given route.
 * @param route it may start with a slash
 * @returns
 */
export function toApiUrl(route: string): string {
  return `${environment.apiUrl}${route}`;
}

/**
 * Fetches a resource with bearer token authentication.
 * It adds the token from localStorage to the Authorization header.
 * If the token is not present, it will not add the header.
 * @param url The URL to fetch.
 * @param options The options for the fetch request.
 * @returns
 */
export function fetchWithAuth(
  url: RequestInfo | URL,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
}

/**
 * Transfers query parameters from one URL to another.
 * It will replace the query parameters of the destination URL with those from the source URL.
 * @param sourceUrl
 * @param destinationUrl
 * @returns
 */
export function transferApiQueryParams(
  sourceUrl: string | null | undefined,
  destinationUrl: string
): string | null {
  try {
    const baseUrl = new URL(window.location.origin);
    const destinationUrlObject = URL.canParse(destinationUrl)
      ? new URL(destinationUrl)
      : new URL(destinationUrl, baseUrl);

    if (sourceUrl) {
      const sourceUrlObject = URL.canParse(sourceUrl)
        ? new URL(sourceUrl)
        : new URL(sourceUrl, baseUrl);

      const sourceQueryParams = sourceUrlObject.search;

      if (sourceQueryParams) {
        destinationUrlObject.search = sourceQueryParams;
      }
    }

    return destinationUrlObject.toString();
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

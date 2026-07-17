import { AppEnvironment } from '../config/app-environment';
import { API_ENDPOINTS } from '../config/api-endpoints';

export function isApiRequest(url: string, config: AppEnvironment): boolean {
  return url.startsWith(config.apiBaseUrl) || (config.apiBaseUrl.startsWith('/') && url.startsWith(config.apiBaseUrl));
}

export function isPublicAuthRequest(url: string): boolean {
  return [API_ENDPOINTS.auth.login, API_ENDPOINTS.auth.refresh].some((path) => url.includes(path));
}

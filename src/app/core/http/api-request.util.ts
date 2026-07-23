import { AppEnvironment } from '../config/app-environment';
import { API_ENDPOINTS } from '../config/api-endpoints';

export function isApiRequest(url: string, config: AppEnvironment): boolean {
  const base = config.apiBaseUrl.replace(/\/+$/, '');
  return url === base || url.startsWith(`${base}/`) || url.startsWith(`${base}?`);
}

export function isPublicAuthRequest(url: string): boolean {
  return [API_ENDPOINTS.auth.login, API_ENDPOINTS.auth.refresh].some((path) => hasPath(url, path));
}

export function isLogoutRequest(url: string): boolean {
  return hasPath(url, API_ENDPOINTS.auth.logout);
}

function hasPath(url: string, path: string): boolean {
  const cleanUrl = url.split(/[?#]/, 1)[0].replace(/\/+$/, '');
  return cleanUrl.endsWith(path);
}

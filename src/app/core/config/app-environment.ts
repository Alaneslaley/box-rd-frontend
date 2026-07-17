export interface AppEnvironment {
  production: boolean;
  apiBaseUrl: string;
  appName: string;
  appVersion: string;
  /** Solo para desarrollo UI aislado; debe mantenerse false fuera de ese contexto. */
  enableMockAuth: boolean;
}

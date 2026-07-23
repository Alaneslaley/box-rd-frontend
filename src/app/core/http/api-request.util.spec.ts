import { AppEnvironment } from '../config/app-environment';
import { isApiRequest, isLogoutRequest, isPublicAuthRequest } from './api-request.util';

describe('api request utilities', () => {
  const config: AppEnvironment = { production: true, apiBaseUrl: 'https://api.example.com/api/v1', appName: 'GymBox', appVersion: '1' };

  it('solo reconoce la base API con límite de segmento', () => {
    expect(isApiRequest('https://api.example.com/api/v1/students', config)).toBe(true);
    expect(isApiRequest('https://api.example.com/api/v10/students', config)).toBe(false);
    expect(isApiRequest('https://api.example.com/api/v1.evil/students', config)).toBe(false);
  });

  it('reconoce únicamente los paths exactos de autenticación pública', () => {
    expect(isPublicAuthRequest('https://api.example.com/api/v1/auth/login')).toBe(true);
    expect(isPublicAuthRequest('https://api.example.com/api/v1/students?next=/auth/login')).toBe(false);
    expect(isLogoutRequest('https://api.example.com/api/v1/auth/logout?device=web')).toBe(true);
  });
});

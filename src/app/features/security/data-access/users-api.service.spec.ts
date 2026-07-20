import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { UsersApiService } from './users-api.service';

describe('UsersApiService', () => {
  let service: UsersApiService; let http: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] }); service = TestBed.inject(UsersApiService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());
  it('lista usuarios con page y size', () => { service.list({ page: 2, size: 25 }).subscribe(); const request = http.expectOne((candidate) => candidate.url === '/api/v1/users'); expect(request.request.method).toBe('GET'); expect(request.request.params.get('page')).toBe('2'); expect(request.request.params.get('size')).toBe('25'); request.flush({ content: [], page: 2, size: 25, totalElements: 0, totalPages: 0, first: false, last: true }); });
  it('crea un usuario con el body exacto', () => { const body = { branchId: 'branch-id', firstName: 'Ana', lastName: 'Box', email: 'ana@gymbox.com', password: 'temporal-segura', roles: ['ADMINISTRADOR'] }; service.create(body).subscribe(); const request = http.expectOne('/api/v1/users'); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(body); request.flush({}); });
  it('actualiza estado mediante PATCH', () => { service.updateStatus('user/id', { status: 'BLOQUEADO' }).subscribe(); const request = http.expectOne('/api/v1/users/user%2Fid/status'); expect(request.request.method).toBe('PATCH'); expect(request.request.body).toEqual({ status: 'BLOQUEADO' }); request.flush({}); });
  it('actualiza roles mediante PUT', () => { service.updateRoles('user-id', { roles: ['INSTRUCTOR'] }).subscribe(); const request = http.expectOne('/api/v1/users/user-id/roles'); expect(request.request.method).toBe('PUT'); expect(request.request.body).toEqual({ roles: ['INSTRUCTOR'] }); request.flush({}); });
});

import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { AttendanceApiService } from './attendance-api.service';
import { AttendanceFacade } from './attendance.facade';

describe('AttendanceFacade', () => {
  const emptyPage = { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true };
  it('carga la asistencia de hoy', () => { const api = { today: vi.fn().mockReturnValue(of(emptyPage)) }; TestBed.configureTestingModule({ providers: [AttendanceFacade, { provide: AttendanceApiService, useValue: api }] }); const facade = TestBed.inject(AttendanceFacade); facade.loadToday(); expect(api.today).toHaveBeenCalledWith({ page: 0, size: 20 }); expect(facade.page()).toEqual(emptyPage); expect(facade.loading()).toBe(false); });
  it('conserva el ApiError controlado', () => { const error: ApiError = { code: 'SERVER_ERROR', message: 'fallo', status: 500 }; const api = { today: vi.fn().mockReturnValue(throwError(() => error)) }; TestBed.configureTestingModule({ providers: [AttendanceFacade, { provide: AttendanceApiService, useValue: api }] }); const facade = TestBed.inject(AttendanceFacade); facade.loadToday(); expect(facade.error()).toEqual(error); expect(facade.loading()).toBe(false); });
});

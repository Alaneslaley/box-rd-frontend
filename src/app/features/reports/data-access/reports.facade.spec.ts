import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { AdminDashboardResponse } from '../models/report.models';
import { ReportsApiService } from './reports-api.service';
import { ReportsFacade } from './reports.facade';

describe('ReportsFacade', () => {
  const dashboard: AdminDashboardResponse = { businessDate: '2026-07-18', branchId: 'branch-id', activeStudents: 12, expiredMemberships: 2, paymentsToday: 4, attendanceToday: 8, incomeToday: [{ currency: 'MXN', amount: 700 }], incomeByMethod: [] };
  it('carga el dashboard y registra la actualización', () => { const api = { getAdminDashboard: vi.fn().mockReturnValue(of(dashboard)) }; TestBed.configureTestingModule({ providers: [ReportsFacade, { provide: ReportsApiService, useValue: api }] }); const facade = TestBed.inject(ReportsFacade); facade.loadDashboard(); expect(api.getAdminDashboard).toHaveBeenCalledOnce(); expect(facade.data()).toEqual(dashboard); expect(facade.lastUpdatedAt()).toBeTruthy(); expect(facade.loading()).toBe(false); });
  it('maneja un error controlado', () => { const error: ApiError = { code: 'SERVER_ERROR', message: 'fallo', status: 500 }; const api = { getAdminDashboard: vi.fn().mockReturnValue(throwError(() => error)) }; TestBed.configureTestingModule({ providers: [ReportsFacade, { provide: ReportsApiService, useValue: api }] }); const facade = TestBed.inject(ReportsFacade); facade.loadDashboard(); expect(facade.error()).toEqual(error); expect(facade.loading()).toBe(false); });
});

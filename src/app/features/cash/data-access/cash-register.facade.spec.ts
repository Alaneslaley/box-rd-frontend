import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CashRegisterApiService } from './cash-register-api.service';
import { CashRegisterFacade } from './cash-register.facade';

describe('CashRegisterFacade', () => {
  const api = { current: vi.fn(), open: vi.fn(), close: vi.fn() };
  let facade: CashRegisterFacade;
  beforeEach(() => { api.current.mockReset(); api.open.mockReset(); api.close.mockReset(); TestBed.configureTestingModule({ providers: [{ provide: CashRegisterApiService, useValue: api }] }); facade = TestBed.inject(CashRegisterFacade); });
  it('trata OPEN_CASH_REGISTER_NOT_FOUND como estado vacío', () => { api.current.mockReturnValue(throwError(() => ({ code: 'OPEN_CASH_REGISTER_NOT_FOUND', message: 'Sin caja', status: 404 }))); facade.loadCurrentCashRegister(); expect(facade.noOpenRegister()).toBe(true); expect(facade.error()).toBeNull(); });
  it('conserva otros errores para la UI', () => { api.current.mockReturnValue(throwError(() => ({ code: 'SERVER_ERROR', message: 'Error', status: 500 }))); facade.loadCurrentCashRegister(); expect(facade.noOpenRegister()).toBe(false); expect(facade.error()?.code).toBe('SERVER_ERROR'); });
  it('expone la caja actual recibida', () => { const register = { id: 'cash-id', branchId: 'branch-id', openedBy: 'user-id', openedAt: '2026-07-17T10:00:00Z', closedBy: null, closedAt: null, initialCash: 500, expectedCash: 500, countedCash: null, difference: null, currency: 'MXN', status: 'OPEN', notes: null }; api.current.mockReturnValue(of(register)); facade.loadCurrentCashRegister(); expect(facade.current()).toEqual(register); });
});

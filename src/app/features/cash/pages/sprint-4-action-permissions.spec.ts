import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PaymentsFacade } from '../../payments/data-access/payments.facade';
import { PaymentsListPageComponent } from '../../payments/pages/payments-list-page.component';
import { CashPageComponent } from '../cash-page.component';
import { CashRegisterFacade } from '../data-access/cash-register.facade';

function user(permissions: string[]) { return { id: 'user-id', branchId: 'branch-id', email: 'caja@gymbox.mx', firstName: 'Usuario', lastName: 'Caja', status: 'ACTIVO', mustChangePassword: false, authzVersion: 1, roles: ['CAJERO'], permissions }; }

describe('acciones visuales de Sprint 4', () => {
  it('muestra Registrar pago con PAGOS_REGISTRAR', async () => {
    const facade = { loading: signal(false), error: signal(null), page: signal(null), loadPayments: vi.fn(), changePage: vi.fn() };
    await TestBed.configureTestingModule({ imports: [PaymentsListPageComponent], providers: [provideRouter([]), { provide: PaymentsFacade, useValue: facade }] }).compileComponents();
    TestBed.inject(AuthSessionStore).setCurrentUser(user(['PAGOS_CONSULTAR', 'PAGOS_REGISTRAR']));
    const fixture = TestBed.createComponent(PaymentsListPageComponent); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Registrar pago');
  });

  it('muestra Abrir caja cuando backend informa que no hay caja actual', async () => {
    TestBed.resetTestingModule();
    const facade = { loading: signal(false), error: signal(null), current: signal(null), noOpenRegister: signal(true), loadCurrentCashRegister: vi.fn() };
    await TestBed.configureTestingModule({ imports: [CashPageComponent], providers: [provideRouter([]), { provide: CashRegisterFacade, useValue: facade }] }).compileComponents();
    TestBed.inject(AuthSessionStore).setCurrentUser(user(['CAJA_CONSULTAR', 'CAJA_ABRIR']));
    const fixture = TestBed.createComponent(CashPageComponent); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Abrir caja');
    expect(fixture.nativeElement.textContent).not.toContain('Cerrar caja');
  });

  it('muestra Cerrar caja cuando existe caja actual y tiene permiso', async () => {
    TestBed.resetTestingModule();
    const register = { id: 'cash-id', branchId: 'branch-id', openedBy: 'user-id', openedAt: '2026-07-17T10:00:00Z', closedBy: null, closedAt: null, initialCash: 500, expectedCash: 800, countedCash: null, difference: null, currency: 'MXN', status: 'OPEN', notes: null };
    const facade = { loading: signal(false), error: signal(null), current: signal(register), noOpenRegister: signal(false), loadCurrentCashRegister: vi.fn() };
    await TestBed.configureTestingModule({ imports: [CashPageComponent], providers: [provideRouter([]), { provide: CashRegisterFacade, useValue: facade }] }).compileComponents();
    TestBed.inject(AuthSessionStore).setCurrentUser(user(['CAJA_CONSULTAR', 'CAJA_CERRAR']));
    const fixture = TestBed.createComponent(CashPageComponent); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Cerrar caja');
    expect(fixture.nativeElement.textContent).not.toContain('Abrir caja');
  });
});

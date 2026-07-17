import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { MembershipsFacade } from '../data-access/memberships.facade';
import { PlansFacade } from '../../plans/data-access/plans.facade';
import { PlansListPageComponent } from '../../plans/pages/plans-list-page.component';
import { MembershipsListPageComponent } from './memberships-list-page.component';

const userWithoutWritePermissions = {
  id: 'user-id', branchId: 'branch-id', email: 'consulta@gymbox.mx', firstName: 'Usuario', lastName: 'Consulta', status: 'ACTIVO',
  mustChangePassword: false, authzVersion: 1, roles: ['CONSULTA'], permissions: ['PLANES_CONSULTAR', 'MEMBRESIAS_CONSULTAR'],
};

describe('acciones visuales de Sprint 3', () => {
  it('oculta alta y edición de planes sin PLANES_GESTIONAR', async () => {
    const plan = { id: 'plan-id', branchId: 'branch-id', name: 'Mensual', description: null, type: 'MONTHLY' as const, price: 900, currency: 'MXN', validityDays: 30, includedClasses: null, status: 'ACTIVO' as const };
    const facade = { loading: signal(false), error: signal(null), page: signal({ content: [plan], page: 0, size: 20, totalElements: 1, totalPages: 1, first: true, last: true }), query: signal({ page: 0, size: 20, includeInactive: false }), loadPlans: vi.fn(), changePage: vi.fn(), setIncludeInactive: vi.fn() };
    await TestBed.configureTestingModule({ imports: [PlansListPageComponent], providers: [provideRouter([]), { provide: PlansFacade, useValue: facade }] }).compileComponents();
    TestBed.inject(AuthSessionStore).setCurrentUser(userWithoutWritePermissions);
    const fixture = TestBed.createComponent(PlansListPageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Nuevo plan');
    expect(fixture.nativeElement.textContent).not.toContain('Editar');
  });

  it('oculta alta y renovación sin permisos de escritura de membresías', async () => {
    TestBed.resetTestingModule();
    const membership = { id: 'membership-id', branchId: 'branch-id', studentId: 'student-id', planId: 'plan-id', planName: 'Mensual', planType: 'MONTHLY' as const, startDate: '2026-07-01', endDate: '2026-07-31', status: 'ACTIVE' as const, includedClasses: null, remainingClasses: null };
    const facade = { loading: signal(false), error: signal(null), page: signal({ content: [membership], page: 0, size: 20, totalElements: 1, totalPages: 1, first: true, last: true }), loadMemberships: vi.fn(), changePage: vi.fn() };
    await TestBed.configureTestingModule({ imports: [MembershipsListPageComponent], providers: [provideRouter([]), { provide: MembershipsFacade, useValue: facade }] }).compileComponents();
    TestBed.inject(AuthSessionStore).setCurrentUser(userWithoutWritePermissions);
    const fixture = TestBed.createComponent(MembershipsListPageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Nueva membresía');
    expect(fixture.nativeElement.textContent).not.toContain('Renovar');
    expect(fixture.nativeElement.textContent).not.toContain('Registrar pago');
  });

  it('muestra Registrar pago en membresías con PAGOS_REGISTRAR', async () => {
    TestBed.resetTestingModule();
    const membership = { id: 'membership-id', branchId: 'branch-id', studentId: 'student-id', planId: 'plan-id', planName: 'Mensual', planType: 'MONTHLY' as const, startDate: '2026-07-01', endDate: '2026-07-31', status: 'ACTIVE' as const, includedClasses: null, remainingClasses: null };
    const facade = { loading: signal(false), error: signal(null), page: signal({ content: [membership], page: 0, size: 20, totalElements: 1, totalPages: 1, first: true, last: true }), loadMemberships: vi.fn(), changePage: vi.fn() };
    await TestBed.configureTestingModule({ imports: [MembershipsListPageComponent], providers: [provideRouter([]), { provide: MembershipsFacade, useValue: facade }] }).compileComponents();
    TestBed.inject(AuthSessionStore).setCurrentUser({ ...userWithoutWritePermissions, permissions: ['MEMBRESIAS_CONSULTAR', 'PAGOS_REGISTRAR'] });
    const fixture = TestBed.createComponent(MembershipsListPageComponent); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Registrar pago');
  });
});

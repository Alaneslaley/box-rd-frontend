import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SecurityFacade } from '../data-access/security.facade';
import { UserRolesPageComponent } from './user-roles-page.component';

describe('UserRolesPageComponent', () => {
  const user = { id: 'user-id', branchId: 'branch-id', email: 'ana@gymbox.com', firstName: 'Ana', lastName: 'Box', status: 'ACTIVO', mustChangePassword: false, authzVersion: 0, roles: ['INSTRUCTOR'], permissions: [] };
  it('invalida roles vacíos y envía RolesRequest correcto', async () => { const facade = { roles: signal([{ id: 'role-id', code: 'ADMINISTRADOR', name: 'Administrador', description: '', permissions: [] }]), rolesLoading: signal(false), rolesError: signal(null), loadRoles: vi.fn(), resolveUserFromCurrentPageOrState: vi.fn().mockReturnValue(of(user)), updateUserRoles: vi.fn().mockReturnValue(of(user)) }; await TestBed.configureTestingModule({ imports: [UserRolesPageComponent], providers: [provideRouter([]), { provide: SecurityFacade, useValue: facade }, { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'user-id' } } } }] }).compileComponents(); const fixture = TestBed.createComponent(UserRolesPageComponent); const component = fixture.componentInstance; const router = TestBed.inject<any>(Router); vi.spyOn(router, 'navigate').mockResolvedValue(true); fixture.detectChanges(); component.form.controls.roles.setValue([]); component.save(); expect(facade.updateUserRoles).not.toHaveBeenCalled(); component.form.controls.roles.setValue(['ADMINISTRADOR']); component.save(); expect(facade.updateUserRoles).toHaveBeenCalledWith('user-id', { roles: ['ADMINISTRADOR'] }); });
});

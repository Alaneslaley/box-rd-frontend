import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { SecurityFacade } from '../data-access/security.facade';
import { UserStatusPageComponent } from './user-status-page.component';

describe('UserStatusPageComponent', () => {
  it('envía StatusRequest correcto', async () => { const user = { id: 'user-id', branchId: 'branch-id', email: 'ana@gymbox.com', firstName: 'Ana', lastName: 'Box', status: 'ACTIVO', mustChangePassword: false, authzVersion: 0, roles: ['INSTRUCTOR'], permissions: [] }; const facade = { resolveUserFromCurrentPageOrState: vi.fn().mockReturnValue(of(user)), updateUserStatus: vi.fn().mockReturnValue(of({ ...user, status: 'BLOQUEADO' })) }; await TestBed.configureTestingModule({ imports: [UserStatusPageComponent], providers: [provideRouter([]), { provide: SecurityFacade, useValue: facade }, { provide: AuthSessionStore, useValue: { user: () => null } }, { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'user-id' } } } }] }).compileComponents(); const fixture = TestBed.createComponent(UserStatusPageComponent); const component = fixture.componentInstance; const router = TestBed.inject(Router); vi.spyOn(router, 'navigate').mockResolvedValue(true); fixture.detectChanges(); component.form.controls.status.setValue('BLOQUEADO'); component.save(); expect(facade.updateUserStatus).toHaveBeenCalledWith('user-id', { status: 'BLOQUEADO' }); });
});

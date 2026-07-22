import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { StudentsFacade } from '../data-access/students.facade';
import { studentErrorMessage } from '../models/student-error-message';
import { studentLevelLabel, studentStatusLabel, studentStatusTone } from '../models/student-labels';
import { StudentResponse } from '../models/student.models';
import { MembershipsFacade } from '../../memberships/data-access/memberships.facade';
import { membershipErrorMessage } from '../../memberships/models/membership-error-message';
import { membershipStatusLabel, membershipStatusTone } from '../../memberships/models/membership-labels';
import { MembershipSnapshot } from '../../memberships/models/membership.models';

@Component({ selector: 'app-student-detail-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  @if (loading()) { <app-loading-state message="Cargando expediente…" /> }
  @else if (error(); as message) { <app-error-state [message]="message" [traceId]="traceId()"><a class="btn btn-secondary" routerLink="/students">Volver al listado</a></app-error-state> }
  @else if (student(); as current) {
    <app-page-header [title]="current.fullName" description="Detalle básico del expediente del alumno." phase="Sprint 2"><div class="header-actions"><a class="btn btn-secondary" routerLink="/students">Volver</a>@if (canEdit) { <a class="btn btn-primary" [routerLink]="['/students', current.id, 'edit']">Editar</a> }</div></app-page-header>
    <div class="detail-grid"><section class="card detail-card"><h2>Datos personales</h2><dl><div><dt>Estado</dt><dd><app-status-badge [label]="statusLabel(current.status)" [tone]="statusTone(current.status)" /></dd></div><div><dt>Nivel</dt><dd>{{ levelLabel(current.level) }}</dd></div><div><dt>Fecha de nacimiento</dt><dd>{{ current.birthDate }}</dd></div><div><dt>Edad</dt><dd>{{ current.age }} años · {{ current.ageCategory }}</dd></div><div><dt>Teléfono celular</dt><dd>@if (current.phone) { <a [href]="'tel:' + current.phone">{{ current.phone }}</a> } @else { Teléfono no disponible }</dd></div><div><dt>Objetivo personal</dt><dd>{{ current.personalGoal || 'No registrado' }}</dd></div></dl></section>
      <section class="card detail-card"><h2>Tutor</h2>@if (current.guardian; as guardian) { <dl><div><dt>Nombre</dt><dd>{{ guardian.firstName }} {{ guardian.lastName }}</dd></div><div><dt>Relación</dt><dd>{{ guardian.relationship }}</dd></div><div><dt>Teléfono</dt><dd>{{ guardian.phone }}</dd></div><div><dt>Correo del tutor</dt><dd>{{ guardian.email || 'No registrado' }}</dd></div></dl> } @else { <p>No hay tutor registrado.</p> }</section>
      <section class="card detail-card"><h2>Contacto de emergencia</h2>@if (current.emergencyContact; as contact) { <dl><div><dt>Nombre</dt><dd>{{ contact.name }}</dd></div><div><dt>Relación</dt><dd>{{ contact.relationship }}</dd></div><div><dt>Teléfono</dt><dd>{{ contact.phone }}</dd></div></dl> } @else { <p>No hay contacto de emergencia registrado.</p> }</section>
    </div>
    <section class="card student-memberships"><div class="section-heading"><div><h2>Membresías</h2><p>Historial de vigencias del alumno.</p></div>@if (canCreateMembership) { <a class="btn btn-primary" routerLink="/memberships/new" [queryParams]="{ studentId: current.id }">Nueva membresía</a> }</div>
      @if (!canViewMemberships) { <p>No tienes permiso de consulta para este módulo.</p> }
      @else if (membershipsLoading()) { <app-loading-state message="Cargando membresías…" /> }
      @else if (membershipsError(); as message) { <app-error-state title="No fue posible cargar las membresías" [message]="message" [traceId]="membershipsTraceId()"><button class="btn btn-secondary" type="button" (click)="loadMemberships(current.id)">Reintentar</button></app-error-state> }
      @else if (!memberships().length) { <p>No hay membresías registradas para este alumno.</p> }
      @else { <div class="membership-cards">@for (membership of memberships(); track membership.id) { <article class="membership-summary"><div><strong>{{ membership.planName }}</strong><small>{{ membership.startDate }} a {{ membership.endDate }}</small></div><div><app-status-badge [label]="membershipStatusLabel(membership.status)" [tone]="membershipStatusTone(membership.status)" />@if (canRenewMembership) { <a class="btn btn-link" [routerLink]="['/memberships', membership.id, 'renew']" [state]="{ membership: membership }">Renovar</a> }</div></article> }</div> }
    </section>
    <div class="placeholder-grid"><section class="state-card"><h2>Asistencia</h2><p>Consulta el historial de entradas o registra una nueva asistencia.</p><div class="form-actions attendance-student-actions">@if (canViewAttendance) { <a class="btn btn-secondary" [routerLink]="['/attendance/student', current.id]">Ver historial</a> }@if (canCheckIn) { <a class="btn btn-primary" routerLink="/attendance/check-in" [queryParams]="{ studentId: current.id }">Registrar check-in</a> }</div></section><section class="state-card"><h2>Seguimiento deportivo</h2><p>Disponible próximamente.</p></section></div>
  }` })
export class StudentDetailPageComponent implements OnInit {
  private readonly facade = inject(StudentsFacade); private readonly membershipsFacade = inject(MembershipsFacade); private readonly route = inject(ActivatedRoute); private readonly session = inject(AuthSessionStore);
  readonly loading = signal(true); readonly error = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined); readonly student = signal<StudentResponse | null>(null);
  readonly canEdit = this.session.hasPermission(PERMISSIONS.STUDENTS_EDIT);
  readonly canViewMemberships = this.session.hasPermission(PERMISSIONS.MEMBERSHIPS_VIEW);
  readonly canCreateMembership = this.session.hasPermission(PERMISSIONS.MEMBERSHIPS_CREATE);
  readonly canRenewMembership = this.session.hasPermission(PERMISSIONS.MEMBERSHIPS_RENEW);
  readonly canViewAttendance = this.session.hasAnyPermission([PERMISSIONS.ATTENDANCE_STUDENT, PERMISSIONS.ATTENDANCE_READ]);
  readonly canCheckIn = this.session.hasPermission(PERMISSIONS.ATTENDANCE_CHECKIN);
  readonly memberships = signal<MembershipSnapshot[]>([]); readonly membershipsLoading = signal(false); readonly membershipsError = signal<string | null>(null); readonly membershipsTraceId = signal<string | undefined>(undefined);
  ngOnInit(): void { const id = this.route.snapshot.paramMap.get('id') ?? ''; this.facade.loadDetail(id).pipe(finalize(() => this.loading.set(false))).subscribe({ next: (student) => { this.student.set(student); if (this.canViewMemberships) this.loadMemberships(student.id); }, error: (error: ApiError) => { this.error.set(studentErrorMessage(error, 'No fue posible cargar el alumno.')); this.traceId.set(error.traceId); } }); }
  loadMemberships(studentId: string): void { this.membershipsLoading.set(true); this.membershipsError.set(null); this.membershipsTraceId.set(undefined); this.membershipsFacade.listByStudent(studentId).pipe(finalize(() => this.membershipsLoading.set(false))).subscribe({ next: (memberships) => this.memberships.set(memberships), error: (error: ApiError) => { this.membershipsError.set(membershipErrorMessage(error, 'No fue posible cargar las membresías del alumno.')); this.membershipsTraceId.set(error.traceId); } }); }
  levelLabel = studentLevelLabel; statusLabel = studentStatusLabel; statusTone = studentStatusTone;
  membershipStatusLabel = membershipStatusLabel; membershipStatusTone = membershipStatusTone;
}

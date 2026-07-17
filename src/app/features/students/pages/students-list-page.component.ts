import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { StudentsFacade } from '../data-access/students.facade';
import { STUDENT_LEVEL_OPTIONS, studentLevelLabel, studentStatusLabel, studentStatusTone } from '../models/student-labels';
import { StudentLevel, StudentStatus } from '../models/student.models';
import { ApiError } from '../../../core/models/api-error.model';
import { studentErrorMessage } from '../models/student-error-message';

@Component({
  selector: 'app-students-list-page',
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, StatusBadgeComponent],
  template: `
    <app-page-header title="Alumnos" description="Consulta y administra los expedientes básicos de alumnos." phase="Sprint 2">
      @if (canCreate) { <a class="btn btn-primary" routerLink="/students/new">Nuevo alumno</a> }
    </app-page-header>

    <section class="card student-filters" aria-label="Filtros de alumnos">
      <div class="form-field"><label for="student-search">Buscar en esta página</label><input id="student-search" type="search" [formControl]="searchControl" placeholder="Nombre o teléfono" /></div>
      <div class="form-field"><label for="student-level">Nivel</label><select id="student-level" [formControl]="levelControl"><option value="">Todos los niveles</option>@for (option of levels; track option.value) { <option [value]="option.value">{{ option.label }}</option> }</select></div>
      <button class="btn btn-secondary" type="button" (click)="clearFilters()">Limpiar filtros</button>
      <p class="filter-note">La API actual pagina en servidor; búsqueda y nivel filtran únicamente la página cargada.</p>
    </section>

    @if (facade.loading()) { <app-loading-state message="Cargando alumnos…" /> }
    @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadStudents()">Reintentar</button></app-error-state> }
    @else if (!facade.students().length) { <app-empty-state title="No hay alumnos para mostrar" description="No se encontraron resultados en la página actual con los filtros seleccionados." /> }
    @else {
      <section class="card students-table-card">
        <div class="table-wrapper"><table><caption>Alumnos registrados</caption><thead><tr><th scope="col">Nombre</th><th scope="col">Contacto</th><th scope="col">Edad</th><th scope="col">Nivel</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
          <tbody>@for (student of facade.students(); track student.id) { <tr><td data-label="Nombre"><strong>{{ student.fullName }}</strong><small>{{ student.ageCategory }}</small></td><td data-label="Contacto">{{ student.phone || 'Sin teléfono' }}</td><td data-label="Edad">{{ student.age }} años</td><td data-label="Nivel">{{ levelLabel(student.level) }}</td><td data-label="Estado"><app-status-badge [label]="statusLabel(student.status)" [tone]="statusTone(student.status)" /></td><td data-label="Acciones"><div class="table-actions"><a class="btn btn-link" [routerLink]="['/students', student.id]">Ver</a>@if (canEdit) { <a class="btn btn-link" [routerLink]="['/students', student.id, 'edit']">Editar</a> }</div></td></tr> }</tbody>
        </table></div>
        @if (facade.page(); as page) { <nav class="pagination" aria-label="Paginación de alumnos"><button class="btn btn-secondary" type="button" [disabled]="page.first" (click)="facade.changePage(page.page - 1)">Anterior</button><span>Página {{ page.page + 1 }} de {{ page.totalPages || 1 }} · {{ page.totalElements }} alumnos</span><button class="btn btn-secondary" type="button" [disabled]="page.last" (click)="facade.changePage(page.page + 1)">Siguiente</button></nav> }
      </section>
    }
  `,
})
export class StudentsListPageComponent implements OnInit {
  readonly facade = inject(StudentsFacade);
  private readonly session = inject(AuthSessionStore);
  private readonly destroyRef = inject(DestroyRef);
  readonly levels = STUDENT_LEVEL_OPTIONS;
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly levelControl = new FormControl<StudentLevel | ''>('', { nonNullable: true });
  readonly canCreate = this.session.hasPermission(PERMISSIONS.STUDENTS_CREATE);
  readonly canEdit = this.session.hasPermission(PERMISSIONS.STUDENTS_EDIT);

  ngOnInit(): void {
    const filters = this.facade.filters();
    this.searchControl.setValue(filters.search ?? '', { emitEvent: false });
    this.levelControl.setValue(filters.level ?? '', { emitEvent: false });
    this.searchControl.valueChanges.pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((search) => this.facade.updateFilters({ search }));
    this.levelControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((level) => this.facade.updateFilters({ level }));
    this.facade.loadStudents();
  }

  clearFilters(): void { this.searchControl.setValue('', { emitEvent: false }); this.levelControl.setValue('', { emitEvent: false }); this.facade.clearFilters(); }
  levelLabel(level: StudentLevel): string { return studentLevelLabel(level); }
  statusLabel(status: StudentStatus): string { return studentStatusLabel(status); }
  statusTone(status: StudentStatus) { return studentStatusTone(status); }
  errorMessage(error: ApiError): string { return studentErrorMessage(error, 'No fue posible cargar la lista de alumnos.'); }
}

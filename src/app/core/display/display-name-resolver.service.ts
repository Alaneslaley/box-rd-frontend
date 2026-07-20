import { Injectable, Injector, inject, signal } from '@angular/core';
import { AuthSessionStore } from '../auth/auth-session.store';
import { StudentsApiService } from '../../features/students/data-access/students-api.service';

/**
 * Resuelve referencias técnicas a textos comprensibles para la interfaz.
 * La caché evita repetir solicitudes mientras la aplicación está abierta.
 */
@Injectable({ providedIn: 'root' })
export class DisplayNameResolverService {
  private readonly injector = inject(Injector);
  private readonly session = inject(AuthSessionStore);
  private readonly studentNames = signal<Record<string, string>>({});
  private readonly requestedStudentIds = new Set<string>();

  studentName(studentId: string | null | undefined): string {
    if (!studentId) return 'Alumno no disponible';
    return this.studentNames()[studentId] ?? 'Alumno registrado';
  }

  preloadStudentNames(ids: readonly (string | null | undefined)[]): void {
    for (const id of new Set(ids.filter((value): value is string => Boolean(value)))) {
      if (this.studentNames()[id] || this.requestedStudentIds.has(id)) continue;
      this.requestedStudentIds.add(id);
      const studentsApi = this.getStudentsApi();
      if (!studentsApi) {
        this.studentNames.update((names) => ({ ...names, [id]: 'Alumno registrado' }));
        continue;
      }
      studentsApi.getById(id).subscribe({
        next: (student) => this.studentNames.update((names) => ({ ...names, [id]: student.fullName || 'Alumno registrado' })),
        error: () => this.studentNames.update((names) => ({ ...names, [id]: 'Alumno registrado' })),
      });
    }
  }

  userName(userId: string | null | undefined): string {
    const current = this.session.user();
    if (userId && current?.id === userId) return [current.firstName, current.lastName].filter(Boolean).join(' ') || 'Usuario registrado';
    return 'Usuario registrado';
  }

  branchLabel(branchId: string | null | undefined): string {
    const currentBranchId = this.session.user()?.branchId;
    return branchId && branchId === currentBranchId ? 'Sucursal actual' : 'Sucursal asignada';
  }

  membershipLabel(): string { return 'Membresía asociada'; }
  cashRegisterLabel(): string { return 'Caja asociada'; }

  private getStudentsApi(): StudentsApiService | null {
    try { return this.injector.get(StudentsApiService); }
    catch { return null; }
  }
}

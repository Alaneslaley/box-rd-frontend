import { Injectable } from '@angular/core';

/**
 * Centraliza fallbacks de presentación. Los nombres provienen de los DTOs de lectura.
 */
@Injectable({ providedIn: 'root' })
export class DisplayNameResolverService {
  studentName(name: string | null | undefined): string { return name?.trim() || 'Alumno no disponible'; }
  userName(name: string | null | undefined): string { return name?.trim() || 'Usuario registrado'; }
  branchLabel(name: string | null | undefined, fallback = 'Sucursal asignada'): string { return name?.trim() || fallback; }

  membershipLabel(): string { return 'Membresía asociada'; }
  cashRegisterLabel(): string { return 'Caja asociada'; }
}

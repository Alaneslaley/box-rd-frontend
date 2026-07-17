import { StatusTone } from '../../../shared/components/status-badge.component';
import { StudentLevel, StudentStatus } from './student.models';

export const STUDENT_LEVEL_OPTIONS: ReadonlyArray<{ value: StudentLevel; label: string }> = [
  { value: 'UNASSIGNED', label: 'Sin asignar' },
  { value: 'BEGINNER', label: 'Principiante' },
  { value: 'INTERMEDIATE', label: 'Intermedio' },
  { value: 'ADVANCED', label: 'Avanzado' },
];

export function studentLevelLabel(level: StudentLevel): string {
  return STUDENT_LEVEL_OPTIONS.find((option) => option.value === level)?.label ?? level;
}

export function studentStatusLabel(status: StudentStatus): string {
  const labels: Record<StudentStatus, string> = { ACTIVO: 'Activo', INACTIVO: 'Inactivo', PRUEBA: 'Prueba', CONGELADO: 'Congelado', BAJA: 'Baja', RESTRINGIDO: 'Restringido' };
  return labels[status];
}

export function studentStatusTone(status: StudentStatus): StatusTone {
  if (status === 'ACTIVO') return 'success';
  if (status === 'PRUEBA' || status === 'CONGELADO') return 'warning';
  if (status === 'RESTRINGIDO') return 'danger';
  return 'neutral';
}

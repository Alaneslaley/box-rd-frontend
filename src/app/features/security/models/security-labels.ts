import { StatusTone } from '../../../shared/components/status-badge.component';

const normalized = (value: string | null | undefined): string => value?.trim().toUpperCase() || 'NO_DISPONIBLE';

export function userStatusLabel(value: string | null | undefined): string {
  return (({ ACTIVO: 'Activo', INACTIVO: 'Inactivo', BLOQUEADO: 'Bloqueado' } as Record<string, string>)[normalized(value)] ?? value) || 'No disponible';
}

export function userStatusTone(value: string | null | undefined): StatusTone {
  const status = normalized(value);
  if (status === 'ACTIVO') return 'success';
  if (status === 'BLOQUEADO') return 'danger';
  if (status === 'INACTIVO') return 'warning';
  return 'neutral';
}

export function passwordChangeLabel(value: boolean): string { return value ? 'Debe cambiar contraseña' : 'Sin cambio pendiente'; }
export function passwordChangeTone(value: boolean): StatusTone { return value ? 'warning' : 'success'; }

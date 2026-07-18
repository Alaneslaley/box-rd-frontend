import { StatusTone } from '../../../shared/components/status-badge.component';

const normalized = (value: string | null | undefined): string => value?.trim().toUpperCase() || 'NO_DISPONIBLE';
const humanize = (value: string | null | undefined): string => normalized(value).toLowerCase().replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());

export function attendanceStatusLabel(value: string | null | undefined): string { return humanize(value); }
export function attendanceStatusTone(value: string | null | undefined): StatusTone {
  const status = normalized(value);
  if (['OK', 'ACTIVE', 'ACTIVA', 'REGISTERED', 'PRESENT', 'PRESENTE', 'ALLOWED'].includes(status)) return 'success';
  if (['PENDING', 'PENDIENTE', 'REVIEW', 'WARNING'].includes(status)) return 'warning';
  if (['DENIED', 'BLOCKED', 'REJECTED', 'FAILED', 'CANCELLED'].includes(status)) return 'danger';
  return 'neutral';
}
export function checkInDecisionLabel(value: string | null | undefined): string { return humanize(value); }
export function checkInDecisionTone(value: string | null | undefined): StatusTone {
  const decision = normalized(value);
  if (['ALLOW', 'ALLOWED', 'APPROVED', 'ACCEPTED', 'OK'].includes(decision)) return 'success';
  if (['WARNING', 'REVIEW', 'PENDING'].includes(decision)) return 'warning';
  if (['DENY', 'DENIED', 'BLOCK', 'BLOCKED', 'REJECTED'].includes(decision)) return 'danger';
  return 'neutral';
}
export function membershipSnapshotLabel(value: string | null | undefined): string { return humanize(value); }
export function membershipSnapshotTone(value: string | null | undefined): StatusTone {
  const status = normalized(value);
  if (['ACTIVE', 'ACTIVA', 'VIGENTE'].includes(status)) return 'success';
  if (['PENDING', 'PENDIENTE', 'FROZEN', 'CONGELADA'].includes(status)) return 'warning';
  if (['EXPIRED', 'VENCIDA', 'REJECTED'].includes(status)) return 'danger';
  return 'neutral';
}
export function attendanceLevelLabel(value: string | null | undefined): string {
  const labels: Record<string, string> = { UNASSIGNED: 'Sin asignar', BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado' };
  return labels[normalized(value)] ?? humanize(value);
}

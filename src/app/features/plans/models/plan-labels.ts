import { StatusTone } from '../../../shared/components/status-badge.component';
import { PlanStatus, PlanType } from './plan.models';

export const PLAN_TYPE_OPTIONS: ReadonlyArray<{ value: PlanType; label: string }> = [
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensual' },
  { value: 'SINGLE_CLASS', label: 'Clase individual' },
  { value: 'CLASS_PACKAGE', label: 'Paquete de clases' },
];

export const planTypeLabel = (type: PlanType): string => PLAN_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
export const planStatusLabel = (status: PlanStatus): string => status === 'ACTIVO' ? 'Activo' : 'Inactivo';
export const planStatusTone = (status: PlanStatus): StatusTone => status === 'ACTIVO' ? 'success' : 'neutral';

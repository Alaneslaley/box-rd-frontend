import { StatusTone } from '../../../shared/components/status-badge.component';
import { PaymentMethod } from './payment.models';

export const PAYMENT_METHOD_OPTIONS: ReadonlyArray<{ value: PaymentMethod; label: string }> = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'MANUAL_CARD', label: 'Tarjeta manual' },
];

const CONCEPT_LABELS: Record<string, string> = { MEMBERSHIP_RENEWAL: 'Renovación de membresía', SINGLE_CLASS: 'Clase individual', CLASS_PACKAGE: 'Paquete de clases' };
const PAYMENT_STATUS_LABELS: Record<string, string> = { REGISTERED: 'Registrado', PAID: 'Pagado', COMPLETED: 'Completado', ACTIVE: 'Activo', OK: 'Correcto', PENDING: 'Pendiente', CANCELLED: 'Cancelado', FAILED: 'Fallido', REJECTED: 'Rechazado' };
const RECEIPT_STATUS_LABELS: Record<string, string> = { READY: 'Listo', GENERATED: 'Generado', PENDING: 'Pendiente', SENT: 'Enviado', FAILED: 'Fallido' };

export const paymentMethodLabel = (method: string): string => PAYMENT_METHOD_OPTIONS.find((option) => option.value === method)?.label ?? method;
export const paymentConceptLabel = (concept: string): string => CONCEPT_LABELS[concept] ?? concept;
export const paymentStatusLabel = (status: string): string => PAYMENT_STATUS_LABELS[status] ?? status;
export const receiptStatusLabel = (status: string): string => RECEIPT_STATUS_LABELS[status] ?? status;
export function paymentStatusTone(status: string): StatusTone { if (['REGISTERED', 'PAID', 'COMPLETED', 'ACTIVE', 'OK'].includes(status)) return 'success'; if (status === 'PENDING') return 'warning'; if (['FAILED', 'REJECTED'].includes(status)) return 'danger'; return 'neutral'; }
export function receiptStatusTone(status: string): StatusTone { if (['READY', 'GENERATED', 'SENT'].includes(status)) return 'success'; if (status === 'PENDING') return 'warning'; if (status === 'FAILED') return 'danger'; return 'neutral'; }

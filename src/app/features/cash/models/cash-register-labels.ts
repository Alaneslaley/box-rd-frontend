import { StatusTone } from '../../../shared/components/status-badge.component';

const LABELS: Record<string, string> = { OPEN: 'Abierta', ABIERTA: 'Abierta', CLOSED: 'Cerrada', CERRADA: 'Cerrada', DIFFERENCE: 'Con diferencia', DESCUADRE: 'Con descuadre' };
export const cashStatusLabel = (status: string): string => LABELS[status] ?? status;
export function cashStatusTone(status: string): StatusTone { if (['OPEN', 'ABIERTA'].includes(status)) return 'success'; if (['DIFFERENCE', 'DESCUADRE'].includes(status)) return 'warning'; return 'neutral'; }

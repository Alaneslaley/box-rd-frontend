import { StatusTone } from '../../../shared/components/status-badge.component';
import { MembershipStatus } from './membership.models';

const LABELS: Record<MembershipStatus, string> = { PENDING: 'Pendiente', ACTIVE: 'Activa', EXPIRED: 'Vencida', FROZEN: 'Congelada', CANCELLED: 'Cancelada' };
const TONES: Record<MembershipStatus, StatusTone> = { PENDING: 'warning', ACTIVE: 'success', EXPIRED: 'danger', FROZEN: 'info', CANCELLED: 'neutral' };

export const membershipStatusLabel = (status: MembershipStatus): string => LABELS[status] ?? status;
export const membershipStatusTone = (status: MembershipStatus): StatusTone => TONES[status] ?? 'neutral';

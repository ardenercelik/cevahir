import type { InventoryStatus } from '@/domain/types';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<InventoryStatus, { label: string; className: string }> = {
  draft: {
    label: 'Taslak',
    className: 'bg-surface-container-high text-on-surface-variant border-outline-variant/60',
  },
  available: {
    label: 'Mevcut',
    className: 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant border-tertiary-fixed-dim',
  },
  reserved: {
    label: 'Rezerve',
    className: 'bg-secondary-container text-on-secondary-container border-secondary-fixed-dim',
  },
  sold: {
    label: 'Satıldı',
    className: 'bg-primary-fixed text-on-primary-fixed-variant border-primary-fixed-dim',
  },
  archived: {
    label: 'Arşiv',
    className: 'bg-surface-container text-outline border-outline-variant/50',
  },
};

export function StatusBadge({ status }: { status: InventoryStatus }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-semibold border',
        cfg.className
      )}
    >
      {cfg.label}
    </span>
  );
}

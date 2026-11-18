import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const USD_TRY_RATE = 38.42;
export const EUR_TRY_RATE = 41.68;
export const GOLD_GRAM_TRY = 3450;
export const EUR_USD_RATE = 1.085;

export type Currency = 'USD' | 'TRY';

export function isPriceSpecified(amountUsd?: number | null): boolean {
  return typeof amountUsd === 'number' && !Number.isNaN(amountUsd) && amountUsd > 0;
}

export function formatCurrency(amountUsd: number | undefined | null, currency: Currency): string {
  if (!isPriceSpecified(amountUsd)) {
    return 'Fiyat Sorunuz';
  }
  const value = currency === 'TRY' ? Math.round(amountUsd! * USD_TRY_RATE) : amountUsd!;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCaratPrice(
  pricePerCaratUsd: number | undefined | null,
  currency: Currency,
  totalPriceUsd?: number | null
): string {
  if (totalPriceUsd !== undefined && !isPriceSpecified(totalPriceUsd)) {
    return '—';
  }
  if (!isPriceSpecified(pricePerCaratUsd)) {
    return '—';
  }
  return `${formatCurrency(pricePerCaratUsd, currency)} / ct`;
}

export function resolveAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const clean = path.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${clean}`;
}

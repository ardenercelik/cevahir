import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Currency } from '@/lib/utils';

interface MarketplaceContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  activeVendorId: string;
  setActiveVendorId: (id: string) => void;
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  compareIds: string[];
  toggleCompare: (diamondId: string) => void;
  removeCompare: (diamondId: string) => void;
  clearCompare: () => void;
  isCompared: (diamondId: string) => boolean;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

const STORAGE_KEYS = {
  currency: 'atelier_b2b_currency',
  activeVendorId: 'atelier_b2b_active_vendor',
  favorites: 'atelier_b2b_favorites',
  compareIds: 'atelier_b2b_compare_ids',
};

function readJsonArray(key: string, fallback: string[]): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.currency);
    return saved === 'TRY' ? 'TRY' : 'USD';
  });

  const [activeVendorId, setActiveVendorIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.activeVendorId) || 'vendor-bosphorus';
  });

  const [favorites, setFavorites] = useState<string[]>(() =>
    readJsonArray(STORAGE_KEYS.favorites, ['dia-10482', 'wat-pepsi-126710'])
  );

  const [compareIds, setCompareIds] = useState<string[]>(() =>
    readJsonArray(STORAGE_KEYS.compareIds, ['dia-10482', 'dia-20194'])
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.currency, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeVendorId, activeVendorId);
  }, [activeVendorId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.compareIds, JSON.stringify(compareIds));
  }, [compareIds]);

  const setCurrency = (c: Currency) => setCurrencyState(c);
  const setActiveVendorId = (id: string) => setActiveVendorIdState(id);

  const toggleFavorite = (listingId: string) => {
    setFavorites((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );
  };

  const isFavorite = (listingId: string) => favorites.includes(listingId);

  const toggleCompare = (diamondId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(diamondId)) return prev.filter((id) => id !== diamondId);
      if (prev.length >= 4) return [...prev.slice(1), diamondId];
      return [...prev, diamondId];
    });
  };

  const removeCompare = (diamondId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== diamondId));
  };

  const clearCompare = () => setCompareIds([]);

  const isCompared = (diamondId: string) => compareIds.includes(diamondId);

  return (
    <MarketplaceContext.Provider
      value={{
        currency,
        setCurrency,
        activeVendorId,
        setActiveVendorId,
        favorites,
        toggleFavorite,
        isFavorite,
        compareIds,
        toggleCompare,
        removeCompare,
        clearCompare,
        isCompared,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside MarketplaceProvider');
  return ctx;
}

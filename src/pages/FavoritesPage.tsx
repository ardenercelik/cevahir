import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Diamond, Watch } from 'lucide-react';
import { listingRepository } from '@/repositories';
import type { DiamondListing, WatchListing } from '@/domain/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { DiamondCard } from '@/components/marketplace/DiamondCard';
import { WatchCard } from '@/components/marketplace/WatchCard';
import { cn } from '@/lib/utils';

export function FavoritesPage() {
  const { favorites } = useMarketplace();
  const [tab, setTab] = useState<'all' | 'diamond' | 'watch'>('all');

  const { data: allListings = [] } = useQuery({
    queryKey: ['listings', 'all'],
    queryFn: () => listingRepository.getAll(true),
  });

  const favListings = allListings.filter((l) => favorites.includes(l.id));
  const filtered = favListings.filter((l) => (tab === 'all' ? true : l.category === tab));

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg-mobile sm:text-headline-lg text-primary flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-error fill-error" />
            <span>Favori İlanlarım</span>
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Takip ettiğiniz pırlanta ve saat stokları yerel tarayıcı hafızanızda saklanır.
          </p>
        </div>

        <div className="inline-flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/40 self-start">
          {[
            { id: 'all', label: `Tümü (${favListings.length})` },
            { id: 'diamond', label: 'Pırlanta' },
            { id: 'watch', label: 'Saat' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-body-sm font-semibold transition-all',
                tab === t.id ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-12 text-center space-y-4">
          <Heart className="w-10 h-10 text-outline mx-auto" />
          <div className="space-y-1">
            <h2 className="text-title-md text-primary">Favori listenizde ürün bulunmuyor.</h2>
            <p className="text-body-sm text-on-surface-variant">
              Katalogdan beğendiğiniz pırlantaları veya saatleri kalp simgesine tıklayarak kaydedebilirsiniz.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Link
              to="/pirlantalar"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary text-label-md"
            >
              <Diamond className="w-4 h-4" />
              Pırlantaları Keşfet
            </Link>
            <Link
              to="/saatler"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-high text-primary text-label-md"
            >
              <Watch className="w-4 h-4" />
              Saatler
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item) =>
            item.category === 'diamond' ? (
              <DiamondCard key={item.id} diamond={item as DiamondListing} />
            ) : (
              <WatchCard key={item.id} watch={item as WatchListing} />
            )
          )}
        </div>
      )}
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, ArrowUpRight, Box, FileCheck2 } from 'lucide-react';
import type { WatchListing } from '@/domain/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { cn, formatCurrency } from '@/lib/utils';
import { MediaImage } from '@/components/common/MediaImage';

export function WatchCard({ watch }: { watch: WatchListing }) {
  const { currency, isFavorite, toggleFavorite } = useMarketplace();
  const fav = isFavorite(watch.id);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden flex flex-col hover:border-secondary hover:shadow-[0_4px_20px_-2px_rgba(23,36,58,0.06)] transition-all group">
      {/* Image Viewport */}
      <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
        <Link to={`/saat/${watch.id}`} className="block w-full h-full">
          <MediaImage
            media={watch.media[0]}
            alt={watch.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-0.5 rounded bg-primary text-on-primary text-label-sm font-bold tracking-wider uppercase">
            {watch.brand}
          </span>
          <span className="px-2 py-0.5 rounded bg-white/90 text-primary text-label-sm font-semibold tabular-nums">
            {watch.productionYear}
          </span>
        </div>

        <button
          type="button"
          onClick={() => toggleFavorite(watch.id)}
          aria-label={fav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors',
            fav
              ? 'bg-error text-white border-error'
              : 'bg-white/90 text-on-surface-variant border-outline-variant/50 hover:text-error'
          )}
        >
          <Heart className={cn('w-4 h-4', fav && 'fill-current')} />
        </button>

        <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded bg-inverse-surface/85 text-inverse-on-surface text-label-sm tabular-nums">
          Ref. {watch.referenceNumber}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <Link
            to={`/saat/${watch.id}`}
            className="text-title-md text-primary hover:text-primary-container transition-colors line-clamp-1"
          >
            {watch.title}
          </Link>
          <p className="text-label-sm text-outline mt-0.5">{watch.condition}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {watch.hasBox && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-primary text-[11px] font-medium">
              <Box className="w-3 h-3 text-secondary" />
              Orijinal Kutu
            </span>
          )}
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium',
              watch.hasPapers
                ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant'
                : 'bg-surface-container-low text-outline'
            )}
          >
            <FileCheck2 className="w-3 h-3" />
            {watch.hasPapers ? 'Sertifikalı' : 'Sertifikasız'}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant text-[11px] font-medium">
            <ShieldCheck className="w-3 h-3 text-tertiary-container" />
            {watch.caseDiameterMm} mm
          </span>
        </div>

        <div className="mt-auto pt-2 border-t border-outline-variant/40 flex items-end justify-between">
          <div>
            <div className="text-label-sm text-outline">Fiyat</div>
            <div className="text-headline-sm text-primary font-bold tabular-nums">
              {formatCurrency(watch.priceUsd, currency)}
            </div>
          </div>
          <span className="text-label-sm text-outline tabular-nums">{watch.sku}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/saat/${watch.id}`}
            className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-surface-container-low text-primary text-label-md hover:bg-surface-container transition-colors"
          >
            <span>Detaylar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/teklif-iste?listingId=${watch.id}`}
            className="inline-flex items-center justify-center py-2 px-3 rounded-lg bg-primary-container text-on-primary text-label-md hover:bg-primary transition-colors"
          >
            Teklif İste
          </Link>
        </div>
      </div>
    </article>
  );
}

import { Link } from 'react-router-dom';
import { Heart, Scale, ShieldCheck, ArrowUpRight } from 'lucide-react';
import type { DiamondListing } from '@/domain/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { cn, formatCaratPrice, formatCurrency } from '@/lib/utils';
import { MediaImage } from '@/components/common/MediaImage';

export function DiamondCard({ diamond }: { diamond: DiamondListing }) {
  const { currency, isFavorite, toggleFavorite, isCompared, toggleCompare } = useMarketplace();
  const fav = isFavorite(diamond.id);
  const compared = isCompared(diamond.id);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden flex flex-col hover:border-secondary hover:shadow-[0_4px_20px_-2px_rgba(23,36,58,0.06)] transition-all group">
      {/* Image Viewport */}
      <div className="relative aspect-square bg-surface-container-low overflow-hidden">
        <Link to={`/pirlanta/${diamond.id}`} className="block w-full h-full">
          <MediaImage
            media={diamond.media[0]}
            alt={diamond.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-primary text-on-primary text-label-sm font-bold tracking-wider">
            {diamond.certLab}
          </span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[11px] font-semibold',
              diamond.origin === 'natural'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-tertiary-fixed text-on-tertiary-fixed'
            )}
          >
            {diamond.origin === 'natural' ? 'Doğal' : 'Lab'}
          </span>
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleFavorite(diamond.id)}
            aria-label={fav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors',
              fav
                ? 'bg-error text-white border-error'
                : 'bg-white/90 text-on-surface-variant border-outline-variant/50 hover:text-error'
            )}
          >
            <Heart className={cn('w-4 h-4', fav && 'fill-current')} />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(diamond.id)}
            aria-label="Karşılaştırmaya ekle"
            title="Karşılaştır"
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors',
              compared
                ? 'bg-primary text-white border-primary'
                : 'bg-white/90 text-on-surface-variant border-outline-variant/50 hover:text-primary'
            )}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom SKU */}
        <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded bg-inverse-surface/85 text-inverse-on-surface text-label-sm tabular-nums">
          {diamond.sku}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <Link
            to={`/pirlanta/${diamond.id}`}
            className="text-title-md text-primary hover:text-primary-container transition-colors line-clamp-1"
          >
            {diamond.carat.toFixed(2)} ct {diamond.shape} Pırlanta
          </Link>
          <p className="text-label-sm text-outline mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-tertiary-container" />
            <span>
              {diamond.certLab === 'Sertifikasız' ? 'Sertifikasız Stok' : diamond.certNumber}
            </span>
          </p>
        </div>

        {/* 3-Column Micro Spec Grid */}
        <div className="grid grid-cols-3 gap-1.5 bg-surface-container-low rounded-lg p-2 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-outline">Renk</div>
            <div className="text-body-sm font-bold text-primary tabular-nums">{diamond.color}</div>
          </div>
          <div className="border-x border-outline-variant/50">
            <div className="text-[10px] uppercase tracking-wider text-outline">Berraklık</div>
            <div className="text-body-sm font-bold text-primary tabular-nums">
              {diamond.clarity}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-outline">Kesim</div>
            <div className="text-body-sm font-bold text-primary truncate px-1">{diamond.cut}</div>
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto pt-2 border-t border-outline-variant/40 flex items-end justify-between gap-2">
          <div>
            <div className="text-label-sm text-outline">Fiyat</div>
            <div className="text-headline-sm text-primary font-bold tabular-nums">
              {formatCurrency(diamond.priceUsd, currency)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-outline tabular-nums">
              {formatCaratPrice(diamond.pricePerCaratUsd, currency, diamond.priceUsd)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/pirlanta/${diamond.id}`}
            className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-surface-container-low text-primary text-label-md hover:bg-surface-container transition-colors"
          >
            <span>İncele</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/teklif-iste?listingId=${diamond.id}`}
            className="inline-flex items-center justify-center py-2 px-3 rounded-lg bg-primary-container text-on-primary text-label-md hover:bg-primary transition-colors"
          >
            Teklif İste
          </Link>
        </div>
      </div>
    </article>
  );
}

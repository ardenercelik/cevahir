import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit3, Send, ArrowLeft } from 'lucide-react';
import { listingRepository } from '@/repositories';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency } from '@/lib/utils';
import { MediaImage } from '@/components/common/MediaImage';
import { StatusBadge } from '@/components/marketplace/StatusBadge';

export function ListingPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currency } = useMarketplace();

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingRepository.getById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <div className="h-80 rounded-xl bg-surface-container-low animate-pulse" />;
  }

  if (!listing) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-10 text-center space-y-3">
        <p className="text-title-md text-primary">Önizlenecek ilan bulunamadı.</p>
        <Link to="/panel/envanter" className="text-label-md text-primary underline">
          Envantere Dön
        </Link>
      </div>
    );
  }

  const handlePublish = async () => {
    await listingRepository.updateStatus(listing.id, 'available');
    await queryClient.invalidateQueries({ queryKey: ['vendor-listings'] });
    await queryClient.invalidateQueries({ queryKey: ['diamonds'] });
    await queryClient.invalidateQueries({ queryKey: ['watches'] });
    await queryClient.invalidateQueries({ queryKey: ['listing', listing.id] });
    navigate('/panel/envanter');
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary-container/70 border border-secondary-fixed-dim rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-label-sm uppercase tracking-wider font-bold text-on-secondary-container">
            İlan Önizleme Modu
          </span>
          <p className="text-body-sm text-on-secondary-fixed">
            İlanınızın pazaryeri alıcılarına nasıl görüneceğini kontrol edin.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/panel/ilan-duzenle/${listing.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-primary text-label-md border border-outline-variant/50"
          >
            <Edit3 className="w-4 h-4" />
            Düzenlemeye Dön
          </Link>
          <button
            type="button"
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary-container text-on-primary text-label-md hover:bg-primary"
          >
            <Send className="w-4 h-4" />
            Pazaryerinde Yayınla (Mevcut)
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 aspect-square rounded-xl overflow-hidden bg-surface-container">
          <MediaImage media={listing.media[0]} className="w-full h-full object-cover" />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <StatusBadge status={listing.status} />
            <span className="text-label-sm text-outline tabular-nums">SKU: {listing.sku}</span>
          </div>
          <h1 className="text-headline-md text-primary">{listing.title}</h1>
          <div className="text-headline-lg text-primary font-bold tabular-nums">
            {formatCurrency(listing.priceUsd, currency)}
          </div>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            {listing.description}
          </p>
          <div className="pt-2">
            <Link
              to="/panel/envanter"
              className="inline-flex items-center gap-1.5 text-label-md text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Envanter Konsoluna Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listingRepository } from '@/repositories';
import type { DiamondListing, WatchListing } from '@/domain/types';
import { DiamondListingFormPage } from '@/pages/vendor/DiamondListingFormPage';
import { WatchListingFormPage } from '@/pages/vendor/WatchListingFormPage';

export function EditListingRouterPage() {
  const { id } = useParams<{ id: string }>();

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingRepository.getById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <div className="h-64 rounded-xl bg-surface-container-low animate-pulse" />;
  }

  if (!listing) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-10 text-center space-y-3">
        <p className="text-title-md text-primary">Düzenlenecek ilan bulunamadı.</p>
        <Link
          to="/panel/envanter"
          className="inline-flex px-4 py-2 rounded-lg bg-primary-container text-on-primary text-label-md"
        >
          Envantere Dön
        </Link>
      </div>
    );
  }

  return listing.category === 'diamond' ? (
    <DiamondListingFormPage existing={listing as DiamondListing} />
  ) : (
    <WatchListingFormPage existing={listing as WatchListing} />
  );
}

import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Star,
  ArrowLeft,
} from 'lucide-react';
import { listingRepository, vendorRepository } from '@/repositories';
import type { DiamondListing, WatchListing } from '@/domain/types';
import { DiamondCard } from '@/components/marketplace/DiamondCard';
import { WatchCard } from '@/components/marketplace/WatchCard';

export function SupplierProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', id],
    queryFn: () => vendorRepository.getById(id!),
    enabled: Boolean(id),
  });

  const { data: vendorListings = [] } = useQuery({
    queryKey: ['vendor-listings', id],
    queryFn: async () => {
      const all = await listingRepository.getByVendor(id!);
      return all.filter((l) => l.status === 'available');
    },
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
        <div className="h-64 rounded-xl bg-surface-container-low animate-pulse" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 text-center space-y-4">
        <h1 className="text-headline-md text-primary">Tedarikçi bulunamadı.</h1>
        <Link
          to="/tedarikciler"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md"
        >
          Tedarikçi Dizinine Dön
        </Link>
      </div>
    );
  }

  const diamonds = vendorListings.filter((l): l is DiamondListing => l.category === 'diamond');
  const watches = vendorListings.filter((l): l is WatchListing => l.category === 'watch');

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 space-y-8">
      <Link
        to="/tedarikciler"
        className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Tüm Tedarikçilere Dön
      </Link>

      {/* Profile Header */}
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-secondary-fixed" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-headline-md text-primary">{vendor.companyName}</h1>
                {vendor.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed/50 text-on-tertiary-fixed-variant text-label-sm font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Onaylı Üye
                  </span>
                )}
              </div>
              <p className="text-body-sm text-outline flex flex-wrap items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  {vendor.city} / {vendor.district}
                </span>
                <span>Oda Sicil: {vendor.chamberRegistrationNo}</span>
                <span>Kuruluş: {vendor.foundedYear}</span>
              </p>
            </div>
          </div>
          <p className="text-body-md text-on-surface-variant leading-relaxed">{vendor.about}</p>
        </div>

        <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-5 space-y-3 border border-outline-variant/40">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-outline">Ticaret Puanı</span>
            <span className="font-bold text-primary inline-flex items-center gap-1 tabular-nums">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              {vendor.rating.toFixed(1)} ({vendor.completedTrades} İşlem)
            </span>
          </div>
          <div className="flex items-center gap-2 text-body-sm text-primary">
            <Phone className="w-4 h-4 text-secondary" />
            <span className="tabular-nums">{vendor.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-body-sm text-primary">
            <Mail className="w-4 h-4 text-secondary" />
            <span>{vendor.email}</span>
          </div>
        </div>
      </div>

      {/* Active Listings */}
      <section className="space-y-4">
        <h2 className="text-headline-sm text-primary">
          Tedarikçinin Aktif Envanteri ({vendorListings.length})
        </h2>

        {vendorListings.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-8 text-center text-on-surface-variant">
            Bu tedarikçinin şu anda yayında aktif ilanı bulunmuyor.
          </div>
        ) : (
          <div className="space-y-8">
            {diamonds.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-title-md text-primary">Pırlanta Stokları ({diamonds.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {diamonds.map((d) => (
                    <DiamondCard key={d.id} diamond={d} />
                  ))}
                </div>
              </div>
            )}

            {watches.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-title-md text-primary">Saat Stokları ({watches.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {watches.map((w) => (
                    <WatchCard key={w.id} watch={w} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

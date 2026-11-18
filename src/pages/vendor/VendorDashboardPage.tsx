import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  PlusCircle,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Diamond,
  Watch,
} from 'lucide-react';
import { inquiryRepository, listingRepository, vendorRepository } from '@/repositories';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/marketplace/StatusBadge';

export function VendorDashboardPage() {
  const { activeVendorId, currency } = useMarketplace();

  const { data: vendor } = useQuery({
    queryKey: ['vendor', activeVendorId],
    queryFn: () => vendorRepository.getById(activeVendorId),
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['vendor-listings', activeVendorId],
    queryFn: () => listingRepository.getByVendor(activeVendorId),
  });

  const { data: inquiries = [] } = useQuery({
    queryKey: ['inquiries', activeVendorId],
    queryFn: () => inquiryRepository.getByVendor(activeVendorId),
  });

  const availableListings = listings.filter((l) => l.status === 'available');
  const reservedListings = listings.filter((l) => l.status === 'reserved');
  const draftListings = listings.filter((l) => l.status === 'draft');
  const totalPortfolioUsd = availableListings.reduce((sum, item) => sum + item.priceUsd, 0);
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-label-sm uppercase tracking-wider text-secondary font-bold">
            Tedarikçi Kokpiti
          </span>
          <h1 className="text-headline-md sm:text-headline-lg text-primary">
            {vendor?.companyName || 'Tedarikçi Paneli'}
          </h1>
        </div>
        <Link
          to="/panel/ilan-ekle"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md hover:bg-primary transition-colors self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni İlan Ekle</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-outline text-label-sm">
            <span>Aktif Stok Değeri</span>
            <TrendingUp className="w-4 h-4 text-tertiary-container" />
          </div>
          <div className="text-headline-sm text-primary font-bold tabular-nums">
            {formatCurrency(totalPortfolioUsd, currency)}
          </div>
          <div className="text-label-sm text-on-surface-variant">
            {availableListings.length} yayında ilan
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-outline text-label-sm">
            <span>Toplam Envanter</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div className="text-headline-sm text-primary font-bold tabular-nums">{listings.length}</div>
          <div className="text-label-sm text-on-surface-variant">
            {reservedListings.length} rezerve · {draftListings.length} taslak
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-outline text-label-sm">
            <span>Gelen Teklifler</span>
            <MessageSquare className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-headline-sm text-primary font-bold tabular-nums">{inquiries.length}</div>
          <div className="text-label-sm text-tertiary-container font-semibold">
            {newInquiriesCount} yeni okunmamış talep
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 space-y-2">
          <div className="text-outline text-label-sm">Hızlı İlan Girişi</div>
          <div className="flex gap-2 pt-1">
            <Link
              to="/panel/ilan-ekle/pirlanta"
              className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg bg-surface-container-low text-primary text-label-sm font-semibold hover:bg-surface-container"
            >
              <Diamond className="w-3.5 h-3.5 text-secondary" />
              Pırlanta
            </Link>
            <Link
              to="/panel/ilan-ekle/saat"
              className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg bg-surface-container-low text-primary text-label-sm font-semibold hover:bg-surface-container"
            >
              <Watch className="w-3.5 h-3.5 text-secondary" />
              Saat
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Listings & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-title-md font-bold text-primary">Son Güncellenen Stoklar</h2>
            <Link to="/panel/envanter" className="text-label-md text-primary hover:underline inline-flex items-center gap-1">
              Tüm Envanter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/40">
            {listings.slice(0, 5).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/panel/ilan-duzenle/${item.id}`}
                    className="text-body-sm font-semibold text-primary hover:underline truncate block"
                  >
                    {item.title}
                  </Link>
                  <div className="text-label-sm text-outline tabular-nums">
                    {item.sku} · {formatCurrency(item.priceUsd, currency)}
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
            {listings.length === 0 && (
              <p className="text-body-sm text-outline py-4">Henüz bu tedarikçiye ait ilan yok.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-title-md font-bold text-primary">Son Gelen Talepler</h2>
            <Link to="/panel/talepler" className="text-label-md text-primary hover:underline inline-flex items-center gap-1">
              Tümü <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/40">
            {inquiries.slice(0, 4).map((inq) => (
              <div key={inq.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-body-sm font-semibold text-primary">{inq.buyerCompany}</span>
                  <span className="text-label-sm font-bold text-tertiary-container tabular-nums">
                    {inq.offerPriceUsd ? formatCurrency(inq.offerPriceUsd, currency) : 'Fiyat Soruldu'}
                  </span>
                </div>
                <p className="text-label-sm text-outline truncate">{inq.listingTitle}</p>
              </div>
            ))}
            {inquiries.length === 0 && (
              <p className="text-body-sm text-outline py-4">Henüz gelen teklif talebi bulunmuyor.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

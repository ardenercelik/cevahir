import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Lock,
  Truck,
  Send,
  CheckCircle2,
  Camera,
  Gavel,
  MessageSquare,
  ArrowRight,
  X,
  Watch,
  SlidersHorizontal,
  Cpu,
} from 'lucide-react';
import { inquiryRepository, listingRepository, vendorRepository } from '@/repositories';
import type { WatchListing } from '@/domain/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { cn, formatCurrency } from '@/lib/utils';
import { MediaImage } from '@/components/common/MediaImage';
import { WatchCard } from '@/components/marketplace/WatchCard';
import { StatusBadge } from '@/components/marketplace/StatusBadge';

const ANGLE_LABELS = [
  { short: '1. Ön Cephe', full: '1. Kadran & Kasa Ön Cephe' },
  { short: '2. Yan & Tepe', full: '2. Kasa Yan Profili & Tepe (Crown)' },
  { short: '3. Kasa Arkası', full: '3. Kasa Arkası (Caseback & Seri No)' },
  { short: '4. Bilezik', full: '4. Bilezik & Bakla Kondisyonu' },
  { short: '5. Kilit & Toka', full: '5. Katlanır Güvenlik Tokası Detayı' },
  { short: '6. Full Set Belge', full: '6. Orijinal Kutu & Garanti Kartı' },
];

export function WatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currency, isFavorite, toggleFavorite } = useMarketplace();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [buyerContactName, setBuyerContactName] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [offerPriceUsd, setOfferPriceUsd] = useState<string>('');
  const [note, setNote] = useState(
    'Merhaba, bu saat için rezerve talebi ve emanet kasada elden teslim detaylarını görüşmek istiyorum. Nakit USD takas veya banka havalesi ile işlem yapılabilir.'
  );

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingRepository.getById(id!),
    enabled: Boolean(id),
  });

  const watch = listing?.category === 'watch' ? (listing as WatchListing) : undefined;

  const { data: vendor } = useQuery({
    queryKey: ['vendor', watch?.vendorId],
    queryFn: () => vendorRepository.getById(watch!.vendorId),
    enabled: Boolean(watch?.vendorId),
  });

  const { data: similarWatches = [] } = useQuery({
    queryKey: ['watches', 'similar', watch?.id],
    queryFn: async () => {
      const all = await listingRepository.getWatches();
      return all.filter((w) => w.id !== watch?.id).slice(0, 4);
    },
    enabled: Boolean(watch),
  });

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
        <div className="h-96 rounded-xl bg-surface-container-low animate-pulse" />
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 text-center space-y-4">
        <h1 className="text-headline-md text-primary">Saat ilanı bulunamadı.</h1>
        <Link
          to="/saatler"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md"
        >
          Saat Kataloğuna Dön
        </Link>
      </div>
    );
  }

  const fav = isFavorite(watch.id);

  const angleThumbs = ANGLE_LABELS.map((item, idx) => ({
    ...item,
    media: watch.media[idx % watch.media.length] || watch.media[0],
  }));

  const handleInlineInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await inquiryRepository.create({
      id: `inq-${Date.now()}`,
      listingId: watch.id,
      listingTitle: watch.title,
      listingSku: watch.sku,
      listingCategory: 'watch',
      vendorId: watch.vendorId,
      buyerCompany: buyerCompany || 'Akredite Horoloji Galeri',
      buyerContactName: buyerContactName || 'Yetkili Alıcı',
      buyerEmail: buyerEmail || 'b2b@saatci.example',
      buyerPhone: buyerPhone || '+90 532 000 00 00',
      offerPriceUsd: offerPriceUsd ? Number(offerPriceUsd) : watch.priceUsd,
      deliveryPreference: 'Kapalıçarşı Emanet Kasa',
      message: note,
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    await queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    setInquiryModalOpen(false);
    setToastMessage(
      `${vendor?.companyName || 'Tedarikçi'} B2B masasına teklifiniz (${watch.referenceNumber}) iletildi.`
    );
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="w-full pb-20 md:pb-10">
      {/* Breadcrumb Bar */}
      <section className="w-full px-4 lg:px-8 py-2.5 bg-surface-container-low/60 border-b border-outline-variant/40">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2 text-label-md text-on-surface-variant">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-primary font-semibold hover:underline mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            <Link to="/" className="hover:text-primary">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link to="/saatler" className="hover:text-primary">
              Saatler
            </Link>
            <span>/</span>
            <span className="text-primary font-semibold">
              {watch.brand} (Ref. {watch.referenceNumber})
            </span>
          </div>
          <span className="font-data-mono text-label-sm text-primary">
            Stok ID: {watch.sku} · {watch.vaultLocation}
          </span>
        </div>
      </section>

      {/* Main 2-Column Split (7 cols Left / 5 cols Right) */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: 6-Angle Gallery + Security Banner */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 space-y-3">
              {/* Featured Large Display */}
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center bg-surface-container-low relative group">
                <MediaImage
                  media={angleThumbs[selectedImageIdx]?.media}
                  alt={watch.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <StatusBadge status={watch.status} />
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary/85 backdrop-blur-sm text-on-primary text-label-sm rounded flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{angleThumbs[selectedImageIdx]?.full}</span>
                </div>
              </div>

              {/* 6 Thumbnails Gallery */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {angleThumbs.map((item, idx) => (
                  <button
                    key={item.short}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={cn(
                      'p-1 bg-surface-container-lowest rounded-lg shadow-sm transition-all relative overflow-hidden group border',
                      selectedImageIdx === idx
                        ? 'ring-2 ring-primary border-primary'
                        : 'border-outline-variant/40 opacity-80 hover:opacity-100'
                    )}
                  >
                    <div className="aspect-square bg-surface-container-low rounded overflow-hidden">
                      <MediaImage media={item.media} className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-1 text-[10px] leading-tight text-primary font-medium truncate">
                      {item.short}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security & Authenticity Banner */}
            <div className="bg-surface-container-low p-4 rounded-xl flex items-start gap-3 border border-outline-variant/40">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                <Gavel className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-title-md text-primary font-bold flex items-center gap-2">
                  <span>Orijinallik &amp; Seri No Gizlilik Beyanı</span>
                  <span className="w-2 h-2 rounded-full bg-tertiary-container" />
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Tüm seri numaraları ve NFC çip kimlikleri, alıcı ve satıcı güvenliği için dijital olarak maskelenmiştir. Kapalıçarşı yetkili saat ekspertiz komisyonu optik ve kronometrik kontrolleri tamamlanmadan teslimat yapılmaz.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Watch Meta, Pricing, CTAs & Supplier Card */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-label-md text-secondary tracking-widest uppercase font-bold">
                  <Watch className="w-4 h-4 text-secondary" />
                  <span>{watch.brand} HOROLOGY</span>
                </div>
                <span className="font-data-mono text-label-sm text-tertiary-container font-semibold">
                  KASADA HAZIR
                </span>
              </div>

              <div>
                <h1 className="text-headline-lg text-primary leading-tight">{watch.title}</h1>
                <p className="text-body-md text-on-surface-variant mt-1">
                  {watch.caseDiameterMm} mm · {watch.caseMaterial} · {watch.caliber} ·{' '}
                  {watch.braceletMaterial} · Ref. {watch.referenceNumber}
                </p>
              </div>

              {/* Badges Rack */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-1 bg-surface-container text-primary text-label-sm font-semibold rounded tabular-nums">
                  {watch.productionYear} ÜRETİM
                </span>
                <span className="px-2.5 py-1 bg-surface-container text-primary text-label-sm font-semibold rounded uppercase">
                  {watch.condition}
                </span>
                <span className="px-2.5 py-1 bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold rounded">
                  {watch.hasBox && watch.hasPapers
                    ? 'FULL SET (KUTU + KART)'
                    : watch.hasPapers
                    ? 'SERTİFİKALI'
                    : 'SERTİFİKASIZ'}
                </span>
              </div>

              {/* Pricing Block */}
              <div className="p-4 bg-surface-container-low rounded-xl flex flex-col gap-2 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-secondary uppercase tracking-wider font-semibold">
                    Fiyat
                  </span>
                  <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold uppercase">
                    Müzakereye Açık
                  </span>
                </div>
                <div className="text-headline-lg text-primary font-bold tracking-tight tabular-nums">
                  {formatCurrency(watch.priceUsd, currency)}
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {watch.description}
                </p>
              </div>

              {/* Primary & Secondary CTA Buttons */}
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOfferPriceUsd(String(watch.priceUsd));
                    setInquiryModalOpen(true);
                  }}
                  className="w-full py-3.5 px-5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-title-md font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Teklif Ver</span>
                </button>
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to={`/teklif-iste?listingId=${watch.id}`}
                    className="py-2.5 px-3 rounded-lg bg-surface-container-high hover:bg-surface-dim text-primary text-body-md font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Satıcıyla İletişim</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(watch.id)}
                    className={cn(
                      'py-2.5 px-3 rounded-lg text-body-md font-semibold transition-colors flex items-center justify-center gap-1.5',
                      fav
                        ? 'bg-error-container text-error'
                        : 'bg-surface-container-high hover:bg-surface-dim text-primary'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', fav && 'fill-current')} />
                    <span>{fav ? 'Favorilerde' : 'Favorilere Ekle'}</span>
                  </button>
                </div>
              </div>

              {/* Delivery & Vault Info */}
              <div className="space-y-1.5 pt-1 text-body-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-tertiary-container shrink-0" />
                  <span>
                    <strong>Kasa Lokasyonu:</strong> {watch.vaultLocation}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-tertiary-container shrink-0" />
                  <span>
                    <strong>Teslimat:</strong> Aynı gün elden teslim veya Loomis zırhlı sigortalı transfer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tertiary-container shrink-0" />
                  <span>
                    <strong>Ödeme:</strong> Atelier B2B Escrow Korumalı Takas Hesabı
                  </span>
                </div>
              </div>
            </div>

            {/* Merchant / Supplier Info Card */}
            {vendor && (
              <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Yetkili B2B Tedarikçi
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-label-sm text-primary">
                    Sicil: {vendor.chamberRegistrationNo}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center text-headline-sm font-bold shrink-0">
                    {vendor.companyName.slice(0, 1)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-title-md text-primary font-bold">
                      <span>{vendor.companyName}</span>
                      <CheckCircle2 className="w-4 h-4 text-tertiary-container" />
                    </div>
                    <span className="text-body-sm text-on-surface-variant">
                      {vendor.district}, {vendor.city}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-surface-container-low rounded-lg text-center font-data-mono">
                  <div>
                    <div className="text-headline-sm text-primary font-bold">
                      {vendor.completedTrades}
                    </div>
                    <div className="text-label-sm text-on-surface-variant">B2B İşlem</div>
                  </div>
                  <div>
                    <div className="text-headline-sm text-tertiary-container font-bold">100%</div>
                    <div className="text-label-sm text-on-surface-variant">Orijinallik</div>
                  </div>
                  <div>
                    <div className="text-headline-sm text-primary font-bold">
                      {vendor.rating.toFixed(1)} / 5
                    </div>
                    <div className="text-label-sm text-on-surface-variant">B2B Skoru</div>
                  </div>
                </div>
                <Link
                  to={`/tedarikci/${vendor.id}`}
                  className="w-full py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-center text-label-md text-primary font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Satıcının Diğer İlanlarını Gör</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE SPECIFICATIONS SECTION */}
      <section className="w-full px-4 lg:px-8 py-10 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <span className="text-label-sm text-secondary uppercase tracking-widest font-bold">
                Ekspertiz ve Teknik Detaylar
              </span>
              <h2 className="text-headline-lg text-primary">
                Kapsamlı Saat Özellikleri Tablosu
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-tertiary-container" />
              <span className="text-label-md text-on-surface-variant">
                Atelier B2B Teknik Muayene Protokolü Onaylı
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-title-md text-primary font-bold pb-1 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-secondary" />
                <span>Kasa, Kadran ve Dış Yapı</span>
              </h3>
              <div className="space-y-1 text-body-sm">
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Marka</span>
                  <span className="font-semibold text-primary">{watch.brand}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Model</span>
                  <span className="font-semibold text-primary">{watch.model}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Referans Numarası</span>
                  <span className="font-data-mono text-primary font-semibold">
                    {watch.referenceNumber}
                  </span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Üretim Yılı</span>
                  <span className="font-data-mono text-primary">{watch.productionYear}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Kondisyon</span>
                  <span className="font-semibold text-tertiary-container">{watch.condition}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Kasa Çapı</span>
                  <span className="font-data-mono text-primary">{watch.caseDiameterMm} mm</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Kasa Malzemesi</span>
                  <span className="text-primary font-medium">{watch.caseMaterial}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Kadran Rengi</span>
                  <span className="text-primary font-medium">{watch.dialColor}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Bilezik &amp; Toka</span>
                  <span className="text-primary font-medium">{watch.braceletMaterial}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-title-md text-primary font-bold pb-1 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-secondary" />
                <span>Mekanizma, Set &amp; Garanti Durumu</span>
              </h3>
              <div className="space-y-1 text-body-sm">
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Mekanizma Tipi</span>
                  <span className="font-semibold text-primary">{watch.movement}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Kalibre</span>
                  <span className="font-data-mono text-primary font-semibold">{watch.caliber}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Güç Rezervi</span>
                  <span className="font-data-mono text-primary">
                    {watch.powerReserveHours} Saat (±2 sn/gün COSC)
                  </span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Cam Tipi</span>
                  <span className="text-primary font-medium">Safir Kristal</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Su Geçirmezlik</span>
                  <span className="font-data-mono text-primary">{watch.waterResistanceM} Metre</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Kutu Durumu</span>
                  <span className="font-semibold text-primary">
                    {watch.hasBox ? 'Orijinal Kutu Mevcut' : 'Kutu Yok'}
                  </span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Belgeler</span>
                  <span className="font-semibold text-primary">
                    {watch.hasPapers ? 'Orijinal Garanti Kartı & Kitapçık' : 'Sertifikasız'}
                  </span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Aftermarket Parça</span>
                  <span className="font-semibold text-primary">YOK (%100 Fabrika Orijinali)</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded bg-surface-container-low">
                  <span className="text-on-surface-variant">Stok Kasası</span>
                  <span className="font-semibold text-tertiary-container">
                    {watch.vaultLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMILAR WATCHES */}
      {similarWatches.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-label-sm text-secondary uppercase tracking-widest font-bold">
                Piyasa Karşılaştırması
              </span>
              <h2 className="text-headline-lg text-primary">Benzer Saat Portföyü</h2>
            </div>
            <Link
              to="/saatler"
              className="text-title-md text-primary hover:text-primary-container flex items-center gap-1"
            >
              <span>Tüm Saat Kataloğu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarWatches.map((sw) => (
              <WatchCard key={sw.id} watch={sw} />
            ))}
          </div>
        </section>
      )}

      {/* INLINE FUNCTIONAL INQUIRY MODAL */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-primary text-on-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-title-md font-bold">Saat Teklif Talebi</h3>
                  <span className="text-label-sm text-surface-variant">
                    {watch.title} (Ref. {watch.referenceNumber})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(false)}
                className="text-surface-variant hover:text-on-primary p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInlineInquirySubmit} className="p-6 space-y-4">
              <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-container rounded-lg overflow-hidden shrink-0">
                    <MediaImage media={watch.media[0]} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-title-md text-primary font-bold">
                      {watch.brand} Ref. {watch.referenceNumber} ({watch.productionYear})
                    </div>
                    <div className="text-label-sm text-on-surface-variant">
                      Stok ID: {watch.sku} · {watch.vaultLocation}
                    </div>
                  </div>
                </div>
                <div className="text-right tabular-nums">
                  <div className="text-label-sm text-on-surface-variant">Fiyat:</div>
                  <div className="text-headline-sm text-primary font-bold">
                    {formatCurrency(watch.priceUsd, currency)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md text-primary mb-1">
                    Yetkili Ad Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerContactName}
                    onChange={(e) => setBuyerContactName(e.target.value)}
                    placeholder="Örn. Selim Kuyumcuyan"
                    className="w-full px-3.5 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-label-md text-primary mb-1">
                    Şirket / Saatçi Ünvanı *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    placeholder="Örn. Aslan Mücevherat Ltd."
                    className="w-full px-3.5 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-label-md text-primary mb-1">
                    Kurumsal Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+90 (5XX) XXX XX XX"
                    className="w-full px-3.5 py-2 bg-surface-container-low rounded-lg font-data-mono text-data-mono text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-label-md text-primary mb-1">
                    Kurumsal E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="b2b@sirketiniz.com"
                    className="w-full px-3.5 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-md text-primary mb-1">
                  Teklif Tutarı (USD) *
                </label>
                <input
                  type="number"
                  required
                  value={offerPriceUsd}
                  onChange={(e) => setOfferPriceUsd(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-container-low rounded-lg font-data-mono text-headline-sm text-primary font-bold tabular-nums focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-label-md text-primary mb-1">
                  Mesaj &amp; Kasa Teslimi Tercihi
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 bg-surface-container-low rounded-lg text-body-sm text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-surface-container-high text-primary text-body-md font-semibold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-body-md font-semibold shadow flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Talep Gönder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-tertiary-fixed/30">
          <CheckCircle2 className="w-6 h-6 text-tertiary-fixed shrink-0" />
          <div>
            <div className="text-title-md font-bold">Talebiniz Başarıyla İletildi</div>
            <div className="text-body-sm text-surface-variant">{toastMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}

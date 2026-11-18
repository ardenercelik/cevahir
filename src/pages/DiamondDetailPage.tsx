import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Heart,
  Scale,
  ShieldCheck,
  Store,
  Truck,
  FileText,
  Camera,
  RotateCw,
  QrCode,
  ArrowRight,
  MessageSquare,
  X,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { inquiryRepository, listingRepository, vendorRepository } from '@/repositories';
import type { DiamondListing } from '@/domain/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { cn, formatCaratPrice, formatCurrency } from '@/lib/utils';
import { MediaImage } from '@/components/common/MediaImage';
import { DiamondCard } from '@/components/marketplace/DiamondCard';

const THUMB_LABELS = ['Üstten Bakış', 'Yan Profil', 'Leke Haritası', 'Sertifika Önizleme'];

export function DiamondDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currency, isFavorite, toggleFavorite, isCompared, toggleCompare } = useMarketplace();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [stageMode, setStageMode] = useState<'photo' | '360'>('photo');
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [buyerContactName, setBuyerContactName] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [offerPriceUsd, setOfferPriceUsd] = useState<string>('');
  const [note, setNote] = useState(
    'Merhaba, bu taş için Kapalıçarşı / Kuyumcukent emanet kasasında fiziki inceleme ve takas randevusu talep ediyoruz.'
  );

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingRepository.getById(id!),
    enabled: Boolean(id),
  });

  const diamond = listing?.category === 'diamond' ? (listing as DiamondListing) : undefined;

  const { data: vendor } = useQuery({
    queryKey: ['vendor', diamond?.vendorId],
    queryFn: () => vendorRepository.getById(diamond!.vendorId),
    enabled: Boolean(diamond?.vendorId),
  });

  const { data: alternatives = [] } = useQuery({
    queryKey: ['diamonds', 'alternatives', diamond?.id],
    queryFn: async () => {
      const all = await listingRepository.getDiamonds();
      return all.filter((d) => d.id !== diamond?.id).slice(0, 4);
    },
    enabled: Boolean(diamond),
  });

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
        <div className="h-96 rounded-xl bg-surface-container-low animate-pulse" />
      </div>
    );
  }

  if (!diamond) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 text-center space-y-4">
        <h1 className="text-headline-md text-primary">Pırlanta ilanı bulunamadı.</h1>
        <Link
          to="/pirlantalar"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md"
        >
          Pırlanta Kataloğuna Dön
        </Link>
      </div>
    );
  }

  const fav = isFavorite(diamond.id);
  const compared = isCompared(diamond.id);

  const thumbItems = [0, 1, 2, 3].map((idx) => ({
    label: THUMB_LABELS[idx],
    media: diamond.media[idx % diamond.media.length] || diamond.media[0],
  }));

  const handleInlineInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await inquiryRepository.create({
      id: `inq-${Date.now()}`,
      listingId: diamond.id,
      listingTitle: diamond.title,
      listingSku: diamond.sku,
      listingCategory: 'diamond',
      vendorId: diamond.vendorId,
      buyerCompany: buyerCompany || 'Akredite B2B Atölye',
      buyerContactName: buyerContactName || 'Yetkili Satınalma',
      buyerEmail: buyerEmail || 'b2b@atolye.example',
      buyerPhone: buyerPhone || '+90 532 000 00 00',
      offerPriceUsd: offerPriceUsd ? Number(offerPriceUsd) : diamond.priceUsd,
      deliveryPreference: 'Kapalıçarşı Emanet Kasa',
      message: note,
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    await queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    setInquiryModalOpen(false);
    setToastMessage(
      `Teklif talebiniz (${diamond.sku}) doğrudan ${vendor?.companyName || 'tedarikçi'} masasına iletildi.`
    );
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="w-full pb-20 md:pb-10">
      {/* BREADCRUMB & UTILITY TICKER */}
      <section className="w-full px-4 lg:px-8 py-2.5 bg-surface-container-low/60 border-b border-outline-variant/40">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2 text-on-surface-variant text-label-md">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-primary font-semibold hover:underline mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            <Link to="/" className="hover:text-primary transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link to="/pirlantalar" className="hover:text-primary transition-colors">
              Pırlantalar
            </Link>
            <span>/</span>
            <span className="text-primary font-semibold">
              {diamond.carat.toFixed(2)} ct {diamond.shape} ({diamond.sku})
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 font-data-mono text-data-mono">
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
              {diamond.vaultLocation} Kasasında Mevcut
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-primary font-semibold">
              Özellik: {diamond.color} / {diamond.clarity} / {diamond.carat.toFixed(2)} ct
            </span>
          </div>
        </div>
      </section>

      {/* MAIN PRODUCT FOLD */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: MEDIA & CERTIFICATE (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/40 relative flex flex-col items-center">
              <div className="w-full flex items-center justify-between z-10">
                <div className="inline-flex p-1 bg-surface-container-low rounded-lg">
                  <button
                    type="button"
                    onClick={() => setStageMode('photo')}
                    className={cn(
                      'px-3 py-1 rounded text-label-md flex items-center gap-1.5 transition-all',
                      stageMode === 'photo'
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-primary'
                    )}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Fotoğraf</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageMode('360')}
                    className={cn(
                      'px-3 py-1 rounded text-label-md flex items-center gap-1.5 transition-all',
                      stageMode === '360'
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-primary'
                    )}
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>360° Muayene</span>
                  </button>
                </div>
              </div>

              <div className="w-full h-[360px] sm:h-[440px] relative flex items-center justify-center overflow-hidden my-3 rounded-lg bg-surface-container-low group">
                {stageMode === 'photo' ? (
                  <MediaImage
                    media={thumbItems[selectedImageIdx]?.media}
                    alt={diamond.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-surface-container-lowest">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <svg
                        className="w-full h-full animate-spin text-primary/30"
                        fill="none"
                        style={{ animationDuration: '14s' }}
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="46"
                          stroke="currentColor"
                          strokeDasharray="4 6"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <div className="absolute inset-4 rounded-full overflow-hidden flex items-center justify-center">
                        <MediaImage
                          media={diamond.media[0]}
                          className="w-full h-full object-cover animate-pulse"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant text-label-md">
                      <RotateCw className="w-4 h-4 text-primary" />
                      <span>360° Optik Turntable Muayene Modu Aktif</span>
                    </div>
                  </div>
                )}

                {diamond.certLab !== 'Sertifikasız' && (
                  <div className="absolute bottom-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5 text-on-surface-variant font-data-mono text-label-sm">
                    <QrCode className="w-3.5 h-3.5 text-tertiary-container" />
                    <span>Lazer Kemer Yazısı: {diamond.certNumber}</span>
                  </div>
                )}
              </div>

              <div className="w-full grid grid-cols-4 gap-2 pt-1">
                {thumbItems.map((t, idx) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => {
                      setStageMode('photo');
                      setSelectedImageIdx(idx);
                    }}
                    className={cn(
                      'p-1 rounded-lg transition-all flex flex-col items-center gap-1 border',
                      selectedImageIdx === idx && stageMode === 'photo'
                        ? 'bg-surface-container-lowest border-primary shadow-sm'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                    )}
                  >
                    <div className="w-full h-14 sm:h-16 rounded overflow-hidden bg-surface-container">
                      <MediaImage media={t.media} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-primary font-medium truncate max-w-full">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Certification Verification Card */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center text-label-md font-bold shrink-0 px-1 text-center">
                  {diamond.certLab}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-title-md text-primary font-bold">
                      {diamond.certLab === 'Sertifikasız'
                        ? 'Atölye Ekspertizli (Sertifikasız Taş)'
                        : `${diamond.certLab} Diamond Report #${diamond.certNumber}`}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-tertiary-container" />
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    {diamond.origin === 'natural' ? 'Doğal Pırlanta' : 'Laboratuvar Pırlantası'} • Fiziki Ekspertiz Garantili
                  </p>
                </div>
              </div>
              {diamond.certLab !== 'Sertifikasız' && (
                <button
                  type="button"
                  onClick={() => setCertModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary text-label-md flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <FileText className="w-4 h-4" />
                  <span>Laboratuvar Sertifikasını İncele (PDF)</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT SPEC & ACTIONS (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="w-full bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded bg-primary-container text-on-primary font-data-mono text-label-sm font-semibold">
                    Stok No: {diamond.sku}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary-container text-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                    Stokta ({diamond.vaultLocation})
                  </span>
                </div>
                <h1 className="text-headline-lg text-primary tracking-tight">
                  {diamond.carat.toFixed(2)} ct {diamond.shape} Pırlanta
                </h1>
                <p className="text-body-md text-on-surface-variant mt-1">
                  {diamond.origin === 'natural' ? 'Doğal Pırlanta' : 'Laboratuvar Pırlantası'} |{' '}
                  {diamond.color} Renk | {diamond.clarity} Berraklık | {diamond.certLab}
                </p>
              </div>

              {/* Pricing Matrix Box */}
              <div className="p-4 rounded-xl bg-surface-container-low space-y-2 border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-primary font-data-mono text-label-sm font-semibold tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                    FİYAT
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-headline-lg text-primary font-bold tracking-tight tabular-nums">
                    {formatCurrency(diamond.priceUsd, currency)}
                  </span>
                  <span className="font-data-mono text-body-sm text-on-surface-variant tabular-nums">
                    {formatCaratPrice(diamond.pricePerCaratUsd, currency, diamond.priceUsd)}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {diamond.description}
                </p>
              </div>

              {/* Primary & Secondary CTA Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setOfferPriceUsd(String(diamond.priceUsd));
                    setInquiryModalOpen(true);
                  }}
                  className="w-full py-3.5 px-5 rounded-xl bg-primary-container text-on-primary hover:bg-primary text-title-md font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-5 h-5" />
                  <span>Teklif Ver</span>
                </button>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(diamond.id)}
                    className={cn(
                      'py-2.5 px-3 rounded-lg text-label-md flex items-center justify-center gap-1.5 transition-colors border',
                      fav
                        ? 'bg-error-container/40 border-error text-error'
                        : 'bg-surface-container-low hover:bg-surface-container-high border-transparent text-primary'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', fav && 'fill-current')} />
                    <span>{fav ? 'Favorilerde' : 'Favorilere Ekle'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCompare(diamond.id)}
                    className={cn(
                      'py-2.5 px-3 rounded-lg text-label-md flex items-center justify-center gap-1.5 transition-colors border',
                      compared
                        ? 'bg-primary-fixed border-primary text-primary'
                        : 'bg-surface-container-low hover:bg-surface-container-high border-transparent text-primary'
                    )}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{compared ? 'Karşılaştırmada' : 'Karşılaştırmaya Ekle'}</span>
                  </button>
                </div>
              </div>

              {/* B2B Assurance Badges Strip */}
              <div className="pt-1 space-y-2 text-body-sm text-on-surface-variant">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <span>Kapalıçarşı / Kuyumcukent Fiziksel Kasa Teslimi</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Bağımsız Gemolog Ekspertiz Onaylı</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span>Sigortalı Zırhlı Kurye ile 24 Saatte Hızlı Transfer</span>
                </div>
              </div>
            </div>

            {/* Supplier Verification Card */}
            {vendor && (
              <div className="w-full bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-title-md font-bold text-primary shrink-0">
                      {vendor.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-title-md text-primary font-bold">{vendor.companyName}</h3>
                      <p className="text-body-sm text-on-surface-variant">
                        {vendor.district}, {vendor.city} · Sicil: {vendor.chamberRegistrationNo}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-label-sm font-semibold shrink-0">
                    {2026 - vendor.foundedYear} Yıllık Üye
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1 text-label-md">
                  <div className="p-2 rounded bg-surface-container-low flex flex-col">
                    <span className="text-on-surface-variant text-label-sm">Tamamlanan Takas</span>
                    <span className="font-data-mono text-primary font-bold">
                      {vendor.completedTrades} Onaylı İşlem
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low flex flex-col">
                    <span className="text-on-surface-variant text-label-sm">Güven Skoru</span>
                    <span className="font-data-mono text-tertiary-container font-bold">
                      %99.8 Kusursuz ({vendor.rating.toFixed(1)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    to={`/tedarikci/${vendor.id}`}
                    className="text-label-md text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Satıcının Diğer İlanları</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/teklif-iste?listingId=${diamond.id}`}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary text-label-md flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Satıcı Masası ile İletişim</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DETAILED TECHNICAL SPECIFICATIONS */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-4">
        <div className="w-full bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/40">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-headline-md text-primary">
                Gemolojik Teknik Özellikler &amp; Ölçüm Raporu
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Taşın fiziksel ölçümleri ve 4C gemolojik parametreleri.
              </p>
            </div>
            <span className="font-data-mono text-label-sm text-on-surface-variant">
              Ref: {diamond.sku}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-title-md text-primary font-bold pb-1">Temel Nitelikler</div>
              <div className="space-y-1 text-body-md">
                <div className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Taş Türü</span>
                  <span className="font-semibold text-primary">
                    {diamond.origin === 'natural'
                      ? 'Doğal Pırlanta (Natural)'
                      : 'Laboratuvar Pırlantası (CVD / HPHT)'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Şekil (Shape)</span>
                  <span className="font-semibold text-primary">{diamond.shape}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Ağırlık (Carat)</span>
                  <span className="font-data-mono font-bold text-primary tabular-nums">
                    {diamond.carat.toFixed(2)} ct
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Renk Derecesi (Color)</span>
                  <span className="font-semibold text-primary">{diamond.color}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Berraklık (Clarity)</span>
                  <span className="font-semibold text-primary">{diamond.clarity}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">En/Boy Oranı (L/W Ratio)</span>
                  <span className="font-data-mono font-semibold text-primary tabular-nums">
                    {diamond.ratio.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-title-md text-primary font-bold pt-2 pb-1">
                Sertifika &amp; Stok Bilgileri
              </div>
              <div className="space-y-1 text-body-md">
                <div className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Sertifika Durumu</span>
                  <span className="font-semibold text-primary">{diamond.certLab}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Rapor Numarası</span>
                  <span className="font-data-mono font-semibold text-primary">
                    {diamond.certLab === 'Sertifikasız' ? '-' : diamond.certNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-title-md text-primary font-bold pb-1">
                İnce Gemolojik Detaylar &amp; Oranlar
              </div>
              <div className="space-y-1 text-body-md">
                <div className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Kesim Kalitesi (Cut)</span>
                  <span className="font-semibold text-primary">{diamond.cut}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Cila (Polish)</span>
                  <span className="font-semibold text-primary">{diamond.polish}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Simetri (Symmetry)</span>
                  <span className="font-semibold text-primary">{diamond.symmetry}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Floresans (Fluorescence)</span>
                  <span className="font-semibold text-primary">{diamond.fluorescence}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Toplam Derinlik (Total Depth %)</span>
                  <span className="font-data-mono font-semibold text-primary tabular-nums">
                    %{diamond.depthPercent}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded">
                  <span className="text-on-surface-variant">Tabla Genişliği (Table %)</span>
                  <span className="font-data-mono font-semibold text-primary tabular-nums">
                    %{diamond.tablePercent}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Fiziksel Ölçüler (Milimetre)</span>
                  <span className="font-data-mono font-bold text-primary tabular-nums">
                    {diamond.measurements}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALTERNATİF KARŞILAŞTIRMA ENVANTERİ */}
      {alternatives.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-headline-md text-primary">Alternatif Karşılaştırma Envanteri</h2>
              <p className="text-body-sm text-on-surface-variant">
                Benzer karat ve berraklık sınıfındaki onaylı Kapalıçarşı takas listeleri.
              </p>
            </div>
            <Link
              to="/pirlantalar"
              className="text-label-md text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>Tüm Benzer Taşları Filtrele</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {alternatives.map((alt) => (
              <DiamondCard key={alt.id} diamond={alt} />
            ))}
          </div>
        </section>
      )}

      {/* INLINE FUNCTIONAL INQUIRY MODAL */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-primary/60 backdrop-blur-sm"
            onClick={() => setInquiryModalOpen(false)}
          />
          <div className="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10">
            <div className="p-5 bg-surface-container-low flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-primary text-label-sm tracking-widest uppercase mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                  Kurumsal B2B Teklif Masası
                </div>
                <h3 className="text-headline-md text-primary">Teklif Talebi Gönder</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Stok Kodu: <strong className="text-primary font-data-mono">{diamond.sku}</strong> •{' '}
                  {vendor?.companyName || 'Tedarikçi'} Masasına İletilir
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 bg-surface-container-high/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-surface-container-lowest overflow-hidden">
                  <MediaImage media={diamond.media[0]} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-title-md text-primary block leading-tight font-bold">
                    {diamond.carat.toFixed(2)} ct {diamond.shape} Pırlanta
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    {diamond.color} / {diamond.clarity} • {diamond.certLab}
                  </span>
                </div>
              </div>
              <div className="text-right tabular-nums">
                <span className="text-headline-sm text-primary font-bold block leading-tight">
                  {formatCurrency(diamond.priceUsd, currency)}
                </span>
                <span className="font-data-mono text-label-sm text-on-surface-variant">
                  {formatCurrency(diamond.pricePerCaratUsd, currency)} / ct
                </span>
              </div>
            </div>

            <form onSubmit={handleInlineInquirySubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md text-primary mb-1">
                    Yetkili Adı Soyadı *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerContactName}
                    onChange={(e) => setBuyerContactName(e.target.value)}
                    placeholder="Örn: Mehmet Yılmaz"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
                <div>
                  <label className="block text-label-md text-primary mb-1">
                    Firma / Atölye Unvanı *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    placeholder="Örn: Karat Mücevherat Ltd."
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
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
                    placeholder="+90 532 000 00 00"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
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
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low text-primary font-bold text-body-md tabular-nums focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-md text-primary mb-1">
                  Kurumsal E-posta
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="satin-alma@firma.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface text-body-md focus:outline-none"
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
                  className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface text-body-sm focus:outline-none"
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
                  className="px-6 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-body-md font-semibold flex items-center gap-1.5 shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>Talebi Gönder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE PDF PREVIEW MODAL */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-primary/60 backdrop-blur-sm"
            onClick={() => setCertModalOpen(false)}
          />
          <div className="relative bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div>
                <span className="text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Dijital Gemoloji Raporu
                </span>
                <h3 className="text-headline-sm text-primary font-bold">
                  {diamond.certLab} Sertifika #{diamond.certNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCertModalOpen(false)}
                className="p-1.5 rounded-lg bg-surface-container-low text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 space-y-2 text-body-sm tabular-nums">
              <div className="flex justify-between">
                <span className="text-outline">Rapor Numarası:</span>
                <strong className="text-primary">{diamond.certNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Kesim &amp; Karat:</span>
                <strong className="text-primary">
                  {diamond.shape} · {diamond.carat.toFixed(2)} ct
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Renk / Berraklık:</span>
                <strong className="text-primary">
                  {diamond.color} / {diamond.clarity}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Kesim / Cila / Simetri:</span>
                <strong className="text-primary">
                  {diamond.cut} / {diamond.polish} / {diamond.symmetry}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Ölçüler:</span>
                <strong className="text-primary">{diamond.measurements}</strong>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCertModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary text-label-md"
              >
                Kapat
              </button>
            </div>
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

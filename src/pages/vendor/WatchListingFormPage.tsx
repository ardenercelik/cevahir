import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye,
  Save,
  Send,
  Diamond,
  Watch,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import type { InventoryStatus, MediaRef, WatchCondition, WatchListing } from '@/domain/types';
import { listingRepository } from '@/repositories';
import { useMarketplace } from '@/context/MarketplaceContext';
import { LocalMediaUploader } from '@/components/vendor/LocalMediaUploader';
import { MediaImage } from '@/components/common/MediaImage';
import { cn, formatCurrency, isPriceSpecified } from '@/lib/utils';

const BRAND_CHIPS = [
  { name: 'Rolex', origin: 'Cenevre' },
  { name: 'Audemars Piguet', origin: 'Le Brassus' },
  { name: 'Patek Philippe', origin: 'Cenevre' },
  { name: 'Vacheron Constantin', origin: 'Cenevre' },
  { name: 'Richard Mille', origin: 'Les Breuleux' },
  { name: 'Cartier', origin: 'Paris' },
];

const CONDITION_CARDS: { value: WatchCondition; title: string; desc: string }[] = [
  {
    value: 'Sıfır / Etiketli',
    title: 'Sıfır / Jelatinli',
    desc: 'Hiç kullanılmamış, fabrika koruma bantları üzerinde.',
  },
  {
    value: 'Çok İyi (Kılcal Çiziksiz)',
    title: 'Mint / Kusursuz',
    desc: 'Mikro kılcal iz dahi yok, polisaj görmemiş orijinal form.',
  },
  {
    value: 'İyi (Kullanılmış)',
    title: 'İyi (Kullanılmış)',
    desc: 'Hafif kullanım izleri, keskin kasa hatları korunmuş.',
  },
  {
    value: 'Koleksiyonluk',
    title: 'Koleksiyonluk',
    desc: 'Nadir referans, tam orijinal koleksiyon kondisyonu.',
  },
];

const watchFormSchema = z.object({
  title: z.string().min(3, 'İlan başlığı zorunludur'),
  sku: z.string().min(2, 'Stok kodu zorunludur'),
  brand: z.string().min(2, 'Marka zorunludur'),
  model: z.string().min(2, 'Model zorunludur'),
  referenceNumber: z.string().min(2, 'Referans numarası zorunludur'),
  productionYear: z.coerce.number().min(1950).max(2026),
  condition: z.enum([
    'Sıfır / Etiketli',
    'Çok İyi (Kılcal Çiziksiz)',
    'İyi (Kullanılmış)',
    'Koleksiyonluk',
  ]),
  hasBox: z.boolean(),
  hasPapers: z.boolean(),
  caseMaterial: z.string().min(2),
  caseDiameterMm: z.coerce.number().min(20).max(60),
  dialColor: z.string().min(2),
  movement: z.string().min(2),
  caliber: z.string().min(2),
  powerReserveHours: z.coerce.number().min(10).max(300),
  braceletMaterial: z.string().min(2),
  waterResistanceM: z.coerce.number().min(0).max(4000),
  priceUsd: z.coerce.number().min(0),
  vaultLocation: z.string().min(3),
  description: z.string().min(5),
});

type WatchFormValues = z.infer<typeof watchFormSchema>;

export function WatchListingFormPage({ existing }: { existing?: WatchListing }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeVendorId, currency } = useMarketplace();
  const [media, setMedia] = useState<MediaRef[]>(
    existing?.media || [{ id: 'seed-default-w', url: 'images/watch_pepsi_1.jpg', alt: 'Saat' }]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WatchFormValues>({
    resolver: zodResolver(watchFormSchema),
    defaultValues: existing
      ? {
          title: existing.title,
          sku: existing.sku,
          brand: existing.brand,
          model: existing.model,
          referenceNumber: existing.referenceNumber,
          productionYear: existing.productionYear,
          condition: existing.condition,
          hasBox: existing.hasBox,
          hasPapers: existing.hasPapers,
          caseMaterial: existing.caseMaterial,
          caseDiameterMm: existing.caseDiameterMm,
          dialColor: existing.dialColor,
          movement: existing.movement,
          caliber: existing.caliber,
          powerReserveHours: existing.powerReserveHours,
          braceletMaterial: existing.braceletMaterial,
          waterResistanceM: existing.waterResistanceM,
          priceUsd: existing.priceUsd,
          vaultLocation: existing.vaultLocation,
          description: existing.description,
        }
      : {
          title: 'Rolex GMT-Master II "Pepsi"',
          sku: `W-${Math.floor(10000 + Math.random() * 89999)}`,
          brand: 'Rolex',
          model: 'GMT-Master II',
          referenceNumber: '126710BLRO',
          productionYear: 2023,
          condition: 'Sıfır / Etiketli',
          hasBox: true,
          hasPapers: true,
          caseMaterial: 'Oystersteel (904L)',
          caseDiameterMm: 40,
          dialColor: 'Siyah (Glossy)',
          movement: 'Otomatik',
          caliber: 'Calibre 3285',
          powerReserveHours: 70,
          braceletMaterial: 'Jubilee Çelik',
          waterResistanceM: 100,
          priceUsd: 20400,
          vaultLocation: 'Kapalıçarşı Sandal Bedesteni Merkez Kasası - Kasa No: S-14',
          description: 'Tam set, kullanılmamış, faturalı ve sertifikalı B2B saat.',
        },
  });

  const liveValues = watch();

  const saveWithStatus = async (
    values: WatchFormValues,
    status: InventoryStatus,
    goPreview = false
  ) => {
    const now = new Date().toISOString();
    const id = existing?.id || `wat-${Date.now()}`;
    const record: WatchListing = {
      id,
      category: 'watch',
      vendorId: existing?.vendorId || activeVendorId,
      status,
      ...values,
      media,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    if (existing) {
      await listingRepository.update(existing.id, record);
    } else {
      await listingRepository.create(record);
    }

    await queryClient.invalidateQueries({ queryKey: ['vendor-listings'] });
    await queryClient.invalidateQueries({ queryKey: ['watches'] });
    await queryClient.invalidateQueries({ queryKey: ['listing', id] });

    if (goPreview) {
      navigate(`/panel/onizleme/${id}`);
    } else {
      navigate('/panel/envanter');
    }
  };

  return (
    <div className="space-y-6">
      {/* Asset Class Switcher & Page Header */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-label-sm uppercase tracking-widest text-secondary font-bold">
              B2B Kurumsal Mücevherat &amp; Saat Borsası
            </span>
            <h1 className="text-headline-md sm:text-headline-lg text-primary font-bold">
              {existing
                ? `Saat İlanını Düzenle (${existing.sku})`
                : 'Portföy Varlık Sınıfı: Saat İlanı Oluştur'}
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl self-start">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-pulse" />
            <span className="text-label-sm text-on-surface-variant uppercase font-semibold">
              Borsa Durumu:
            </span>
            <span className="font-data-mono text-data-mono font-semibold text-primary">
              Canlı Takas Açık
            </span>
          </div>
        </div>

        {/* Dual Asset Class Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/panel/ilan-ekle/pirlanta"
            className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40 hover:border-primary transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                <Diamond className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-title-md text-on-surface font-semibold">
                    Pırlanta Ekle
                  </span>
                  <span className="text-label-sm bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded">
                    Pırlanta Sihirbazına Geç
                  </span>
                </div>
                <span className="text-body-sm text-on-surface-variant">
                  Doğal &amp; Lab-Grown Tektaş ve Fantezi Kesim Girişi
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-between p-4 bg-primary rounded-xl text-on-primary shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                <Watch className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-title-md text-on-primary font-bold">Saat Ekle</span>
                  <span className="text-label-sm bg-secondary text-on-secondary font-semibold px-2 py-0.5 rounded-full">
                    Aktif Modül
                  </span>
                </div>
                <span className="text-body-sm text-surface-container-high">
                  Rolex, Audemars Piguet, Patek Philippe, Vacheron Constantin
                </span>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-secondary-fixed shrink-0" />
          </div>
        </div>
      </section>

      {/* 4-Step Horizontal Stepper */}
      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { num: '1', label: 'Saat Kimliği & Kondisyon' },
            { num: '2', label: '6 Açılı Fotoğraf & Ekspertiz' },
            { num: '3', label: 'Fiyat & Kasa' },
            { num: '4', label: 'Önizleme & Lansman' },
          ].map((s) => (
            <div
              key={s.num}
              className="flex items-center gap-2.5 p-2 bg-surface-container-low rounded-lg"
            >
              <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-data-mono font-bold text-body-sm shrink-0">
                {s.num}
              </div>
              <span className="text-body-sm font-bold text-primary truncate">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main 2-Column Split (8 cols Form / 4 cols Sticky Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form className="lg:col-span-8 space-y-6">
          {/* Section 1: Saat Kimliği & Model Özellikleri */}
          <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-4">
            <h2 className="text-headline-sm text-primary font-bold border-b border-outline-variant/40 pb-2">
              1. Saat Kimliği &amp; Model Özellikleri
            </h2>

            {/* Brand Chips */}
            <div className="space-y-1.5">
              <label className="text-label-md text-on-surface font-semibold block">
                Marka Seçimi *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {BRAND_CHIPS.map((b) => {
                  const selected = liveValues.brand === b.name;
                  return (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => setValue('brand', b.name)}
                      className={cn(
                        'flex flex-col items-center justify-center p-2.5 rounded-lg text-body-sm font-semibold transition-all',
                        selected
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      )}
                    >
                      <span className="truncate max-w-full">{b.name}</span>
                      <span
                        className={cn(
                          'text-[10px]',
                          selected ? 'text-surface-container-high' : 'text-on-surface-variant'
                        )}
                      >
                        {b.origin}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-label-md text-on-surface font-semibold mb-1">
                  İlan Başlığı *
                </label>
                <input
                  {...register('title')}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-body-sm font-semibold text-primary border border-outline-variant/50"
                />
                {errors.title && (
                  <p className="text-label-sm text-error mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-label-md text-on-surface font-semibold mb-1">
                  Stok Kodu (SKU) *
                </label>
                <input
                  {...register('sku')}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 font-data-mono text-body-sm font-bold text-primary border border-outline-variant/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-label-md text-on-surface font-semibold mb-1">
                  Model / Koleksiyon *
                </label>
                <input
                  {...register('model')}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-body-sm font-semibold text-primary border border-outline-variant/50"
                />
              </div>
              <div>
                <label className="block text-label-md text-on-surface font-semibold mb-1">
                  Referans Numarası *
                </label>
                <input
                  {...register('referenceNumber')}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 font-data-mono text-body-sm font-bold text-primary border border-outline-variant/50 uppercase"
                />
              </div>
              <div>
                <label className="block text-label-md text-on-surface font-semibold mb-1">
                  Üretim Yılı *
                </label>
                <input
                  type="number"
                  {...register('productionYear')}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 font-data-mono text-body-sm font-bold text-primary border border-outline-variant/50 tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-label-sm text-on-surface-variant font-semibold mb-1">
                  Kasa Çapı (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('caseDiameterMm')}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2 font-data-mono text-body-sm font-semibold text-primary border border-outline-variant/50"
                />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-semibold mb-1">
                  Kasa Malzemesi
                </label>
                <input
                  {...register('caseMaterial')}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-sm font-semibold text-primary border border-outline-variant/50"
                />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-semibold mb-1">
                  Kadran Rengi
                </label>
                <input
                  {...register('dialColor')}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-sm font-semibold text-primary border border-outline-variant/50"
                />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-semibold mb-1">
                  Bilezik / Kayış
                </label>
                <input
                  {...register('braceletMaterial')}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-sm font-semibold text-primary border border-outline-variant/50"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Kondisyon, Belgeler (Sertifikalı veya Sertifikasız) */}
          <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-4">
            <h2 className="text-headline-sm text-primary font-bold border-b border-outline-variant/40 pb-2">
              2. Kondisyon, Kutu &amp; Sertifika Durumu
            </h2>

            <div className="space-y-1.5">
              <label className="text-label-md text-on-surface font-semibold block">
                Kondisyon Derecesi *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {CONDITION_CARDS.map((c) => {
                  const selected = liveValues.condition === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setValue('condition', c.value)}
                      className={cn(
                        'p-3 rounded-lg text-left transition-all flex flex-col gap-1',
                        selected
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                      )}
                    >
                      <span className="text-body-md font-bold">{c.title}</span>
                      <span
                        className={cn(
                          'text-label-sm',
                          selected ? 'text-surface-container-high' : 'text-on-surface-variant'
                        )}
                      >
                        {c.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 Set Options including Sertifikasız */}
            <div className="space-y-1.5">
              <label className="text-label-md text-on-surface font-semibold block">
                Kutu &amp; Sertifika Durumu (Sertifikasız Eklenebilir)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  {
                    label: 'Full Set (Kutu + Sertifika)',
                    desc: 'Orijinal kutu ve garanti kartı tam',
                    box: true,
                    papers: true,
                  },
                  {
                    label: 'Yalnızca Sertifika',
                    desc: 'Garanti kartı var, kutu yok',
                    box: false,
                    papers: true,
                  },
                  {
                    label: 'Sertifikasız (Yalnızca Kutu)',
                    desc: 'Kutu mevcut, sertifika yok',
                    box: true,
                    papers: false,
                  },
                  {
                    label: 'Sertifikasız (Yalnızca Saat)',
                    desc: 'Kutu ve sertifika yok (Ekspertizli)',
                    box: false,
                    papers: false,
                  },
                ].map((opt) => {
                  const active =
                    liveValues.hasBox === opt.box && liveValues.hasPapers === opt.papers;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setValue('hasBox', opt.box);
                        setValue('hasPapers', opt.papers);
                      }}
                      className={cn(
                        'p-3 rounded-lg text-left transition-all flex flex-col gap-1',
                        active
                          ? 'bg-primary-container text-on-primary shadow-sm'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      )}
                    >
                      <span className="text-body-sm font-bold">{opt.label}</span>
                      <span
                        className={cn(
                          'text-label-sm',
                          active ? 'text-inverse-on-surface' : 'text-on-surface-variant'
                        )}
                      >
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-sm">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-body-md font-bold text-primary block">
                  Atelier B2B Otomatik Seri No &amp; NFC Maskelemesi
                </span>
                <p className="text-body-sm text-on-surface-variant">
                  İlan yayına alındığında seri numarası otomatik maskelenir ve yalnızca emanet kasasında fiziki kontrol aşamasında alıcıya açılır.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: 6 Açılı Muayene Fotoğrafları */}
          <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-4">
            <h2 className="text-headline-sm text-primary font-bold border-b border-outline-variant/40 pb-2">
              3. 6 Açılı Muayene Fotoğrafları &amp; Makro İnceleme
            </h2>
            <LocalMediaUploader media={media} onChange={setMedia} />
          </section>

          {/* Section 4: Fiyatlama & Emanet Kasası */}
          <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-4">
            <h2 className="text-headline-sm text-primary font-bold border-b border-outline-variant/40 pb-2">
              4. Fiyat &amp; Emanet Kasası
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-label-md text-on-surface font-semibold">
                    Fiyat ($ USD) <span className="text-outline font-normal">(Opsiyonel)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setValue('priceUsd', Number(liveValues.priceUsd) > 0 ? 0 : 21500)
                    }
                    className={cn(
                      'px-2 py-0.5 rounded text-label-sm font-bold transition-colors',
                      !isPriceSpecified(Number(liveValues.priceUsd))
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container-low text-secondary hover:bg-surface-container'
                    )}
                  >
                    {!isPriceSpecified(Number(liveValues.priceUsd))
                      ? '✓ Fiyat Sorunuz Aktif'
                      : 'Fiyat Belirtme (Fiyat Sorunuz)'}
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  placeholder="Boş veya 0 = Fiyat Sorunuz"
                  {...register('priceUsd')}
                  className="w-full bg-surface-container-low text-primary font-data-mono text-headline-md font-bold px-3.5 py-2 rounded-lg border border-outline-variant/50 tabular-nums"
                />
                <p className="text-label-sm text-outline mt-1">
                  Fiyat girilmezse veya 0 bırakılırsa katalogda <strong>&quot;Fiyat Sorunuz&quot;</strong> olarak görünür.
                </p>
              </div>
              <div>
                <label className="block text-label-md text-on-surface font-semibold mb-1">
                  Fiziksel Emanet Kasası &amp; Teslim Lokasyonu *
                </label>
                <input
                  {...register('vaultLocation')}
                  className="w-full bg-surface-container-low text-on-surface text-body-md font-semibold px-3.5 py-2.5 rounded-lg border border-outline-variant/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-label-md text-on-surface font-semibold mb-1">
                Ekspertiz &amp; Kondisyon Açıklaması
              </label>
              <textarea
                rows={3}
                {...register('description')}
                className="w-full bg-surface-container-low rounded-lg px-3.5 py-2 text-body-sm border border-outline-variant/50"
              />
            </div>
          </section>
        </form>

        {/* RIGHT COLUMN: Sticky Live Preview & Verification Checklist */}
        <aside className="lg:col-span-4 flex flex-col gap-4 sticky top-24">
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md border border-outline-variant/40 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-body-md font-bold text-primary">
                Canlı B2B Kart Önizlemesi
              </span>
              <span className="font-data-mono text-xs bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-semibold">
                ID: #{liveValues.sku}
              </span>
            </div>

            <div className="rounded-xl overflow-hidden bg-surface-container-low flex flex-col shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-surface-container overflow-hidden">
                <MediaImage media={media[0]} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                  <span className="text-[10px] bg-primary text-on-primary font-bold px-2 py-0.5 rounded uppercase">
                    {liveValues.brand}
                  </span>
                  <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed font-bold px-1.5 py-0.5 rounded">
                    {liveValues.hasBox && liveValues.hasPapers
                      ? 'Full Set'
                      : liveValues.hasPapers
                      ? 'Sertifikalı'
                      : 'Sertifikasız'}
                  </span>
                </div>
                <span className="absolute top-2.5 right-2.5 font-data-mono text-xs bg-surface-container-lowest/90 backdrop-blur-md text-primary font-bold px-2 py-0.5 rounded shadow-sm">
                  {liveValues.productionYear}
                </span>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                      Fiyat
                    </span>
                    <span className="text-headline-sm font-bold text-primary tabular-nums">
                      {formatCurrency(Number(liveValues.priceUsd) || 0, currency)}
                    </span>
                  </div>
                  <span className="text-label-sm bg-tertiary-container text-on-tertiary font-bold px-2 py-1 rounded">
                    {liveValues.condition.split(' ')[0]}
                  </span>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <span className="text-body-md font-bold text-on-surface block leading-tight">
                    {liveValues.title}
                  </span>
                  <span className="font-data-mono text-xs text-on-surface-variant">
                    Ref: {liveValues.referenceNumber} · {liveValues.braceletMaterial} ·{' '}
                    {liveValues.caseDiameterMm}mm
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="p-1.5 rounded bg-surface-container-lowest">
                    <span className="text-[10px] text-on-surface-variant block">Kasa</span>
                    <span className="text-xs font-semibold text-primary truncate block">
                      {liveValues.caseMaterial}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-surface-container-lowest">
                    <span className="text-[10px] text-on-surface-variant block">Kadran</span>
                    <span className="text-xs font-semibold text-primary truncate block">
                      {liveValues.dialColor}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-surface-container-lowest">
                    <span className="text-[10px] text-on-surface-variant block">Set</span>
                    <span className="text-xs font-semibold text-primary truncate block">
                      {liveValues.hasBox && liveValues.hasPapers
                        ? 'Tam Takım'
                        : liveValues.hasPapers
                        ? 'Sertifikalı'
                        : 'Sertifikasız'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wizard Action Controls */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit((v) => saveWithStatus(v, 'available', false))}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-title-md font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{existing ? 'Değişiklikleri Yayınla' : 'İlanı Yayına Al (Onay)'}</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit((v) => saveWithStatus(v, 'draft', true))}
                  className="py-2.5 px-3 bg-surface-container-low hover:bg-surface-container text-primary rounded-lg text-body-sm font-semibold flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Önizle</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit((v) => saveWithStatus(v, 'draft', false))}
                  className="py-2.5 px-3 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-lg text-body-sm font-semibold flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Taslak Kaydet</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

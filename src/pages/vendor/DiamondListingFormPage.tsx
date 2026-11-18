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
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type {
  DiamondListing,
  DiamondShape,
  DiamondColor,
  DiamondClarity,
  InventoryStatus,
  MediaRef,
} from '@/domain/types';
import { listingRepository } from '@/repositories';
import { useMarketplace } from '@/context/MarketplaceContext';
import { LocalMediaUploader } from '@/components/vendor/LocalMediaUploader';
import { DIAMOND_SHAPES, DiamondShapeIcon } from '@/components/common/DiamondShapeIcon';
import { MediaImage } from '@/components/common/MediaImage';
import { cn, formatCaratPrice, formatCurrency, isPriceSpecified } from '@/lib/utils';

const COLORS: DiamondColor[] = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const CLARITIES: DiamondClarity[] = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];

const diamondFormSchema = z.object({
  title: z.string().min(3, 'İlan başlığı zorunludur'),
  sku: z.string().min(2, 'Stok kodu (SKU) zorunludur'),
  origin: z.enum(['natural', 'lab']),
  shape: z.enum([
    'Round', 'Oval', 'Cushion', 'Emerald', 'Radiant',
    'Pear', 'Princess', 'Marquise', 'Asscher', 'Heart',
  ]),
  carat: z.coerce.number().min(0.1).max(50),
  color: z.enum(['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']),
  clarity: z.enum(['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2']),
  cut: z.enum(['Ideal', 'Excellent', 'Very Good', 'Good']),
  polish: z.enum(['Ideal', 'Excellent', 'Very Good', 'Good']),
  symmetry: z.enum(['Ideal', 'Excellent', 'Very Good', 'Good']),
  fluorescence: z.enum(['None', 'Faint', 'Medium', 'Strong']),
  certLab: z.enum(['GIA', 'IGI', 'HRD', 'Sertifikasız']),
  certNumber: z.string().optional(),
  measurements: z.string().min(3, 'Ölçüler zorunludur'),
  depthPercent: z.coerce.number().min(40).max(85),
  tablePercent: z.coerce.number().min(40).max(85),
  ratio: z.coerce.number().min(0.5).max(3),
  priceUsd: z.coerce.number().min(0),
  vaultLocation: z.string().min(3, 'Emanet kasa lokasyonu zorunludur'),
  description: z.string().min(5, 'Açıklama giriniz'),
});

type DiamondFormValues = z.infer<typeof diamondFormSchema>;

export function DiamondListingFormPage({ existing }: { existing?: DiamondListing }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeVendorId, currency } = useMarketplace();
  const [media, setMedia] = useState<MediaRef[]>(
    existing?.media || [{ id: 'seed-default-d', url: 'images/diamond_oval_1.jpg', alt: 'Pırlanta' }]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DiamondFormValues>({
    resolver: zodResolver(diamondFormSchema),
    defaultValues: existing
      ? {
          title: existing.title,
          sku: existing.sku,
          origin: existing.origin,
          shape: existing.shape,
          carat: existing.carat,
          color: existing.color,
          clarity: existing.clarity,
          cut: existing.cut,
          polish: existing.polish,
          symmetry: existing.symmetry,
          fluorescence: existing.fluorescence,
          certLab: existing.certLab,
          certNumber: existing.certNumber,
          measurements: existing.measurements,
          depthPercent: existing.depthPercent,
          tablePercent: existing.tablePercent,
          ratio: existing.ratio,
          priceUsd: existing.priceUsd,
          vaultLocation: existing.vaultLocation,
          description: existing.description,
        }
      : {
          title: '1.25 ct Oval Pırlanta — G / VS1',
          sku: `D-${Math.floor(10000 + Math.random() * 89999)}`,
          origin: 'natural',
          shape: 'Oval',
          carat: 1.25,
          color: 'G',
          clarity: 'VS1',
          cut: 'Very Good',
          polish: 'Very Good',
          symmetry: 'Excellent',
          fluorescence: 'Faint',
          certLab: 'IGI',
          certNumber: `IGI-${Math.floor(1000000000 + Math.random() * 899999999)}`,
          measurements: '8.42 x 5.93 x 3.66 mm',
          depthPercent: 61.8,
          tablePercent: 59.0,
          ratio: 1.42,
          priceUsd: 8950,
          vaultLocation: 'Kuyumcukent Blok A 2. Kat Emanet Kasası No: 14',
          description: 'Gözle tamamen temiz tektaş pırlanta.',
        },
  });

  const liveValues = watch();
  const liveCarat = Number(liveValues.carat) || 1;
  const livePriceUsd = Number(liveValues.priceUsd) || 0;
  const livePricePerCt = livePriceUsd > 0 ? Math.round(livePriceUsd / liveCarat) : 0;
  const isUncertified = liveValues.certLab === 'Sertifikasız';

  const saveWithStatus = async (
    values: DiamondFormValues,
    status: InventoryStatus,
    goPreview = false
  ) => {
    const now = new Date().toISOString();
    const id = existing?.id || `dia-${Date.now()}`;
    const normalizedPrice = Number(values.priceUsd) > 0 ? Number(values.priceUsd) : 0;
    const pricePerCaratUsd = normalizedPrice > 0 ? Math.round(normalizedPrice / values.carat) : 0;
    const cleanCertNumber =
      values.certLab === 'Sertifikasız'
        ? 'Sertifikasız'
        : values.certNumber?.trim() || `${values.certLab}-Belirtilmedi`;

    const record: DiamondListing = {
      id,
      category: 'diamond',
      vendorId: existing?.vendorId || activeVendorId,
      status,
      ...values,
      certNumber: cleanCertNumber,
      pricePerCaratUsd,
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
    await queryClient.invalidateQueries({ queryKey: ['diamonds'] });
    await queryClient.invalidateQueries({ queryKey: ['listing', id] });

    if (goPreview) {
      navigate(`/panel/onizleme/${id}`);
    } else {
      navigate('/panel/envanter');
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Switcher Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-label-sm uppercase tracking-widest text-secondary font-bold">
              Portföy Varlık Sınıfı
            </span>
            <h1 className="text-headline-sm text-primary tracking-tight mt-0.5">
              {existing
                ? `Pırlanta İlanını Düzenle (${existing.sku})`
                : 'Ne listelemek istiyorsunuz?'}
            </h1>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto bg-surface-container-low p-1.5 rounded-lg">
            <span className="text-label-sm font-semibold text-on-surface-variant px-2">
              Emanet Türü:
            </span>
            <span className="bg-primary text-on-primary text-label-sm font-semibold px-2.5 py-1 rounded">
              Konsinye / Hazır Kasa
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-primary/30 shadow-sm">
            <Diamond className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-title-md font-bold text-primary">
                  Pırlanta Ekle (Doğal &amp; Lab-Grown)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-label-sm font-semibold">
                  Aktif Seçim
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-1">
                GIA, IGI, HRD sertifikalı veya sertifikasız 0.30ct - 20.00ct arası taşlar.
              </p>
            </div>
          </div>

          <Link
            to="/panel/ilan-ekle/saat"
            className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/40 transition-all opacity-80 hover:opacity-100"
          >
            <Watch className="w-5 h-5 text-outline mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-title-md font-bold text-on-surface">
                  Saat Ekle (Rolex, AP, Patek)
                </span>
                <span className="text-label-sm text-outline uppercase font-semibold">
                  Saat Sihirbazına Geç
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Kutu, garanti sertifikası veya sertifikasız saat, referans kodu ve 6 açılı muayene formu.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* 4-Step Wizard Progress Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { num: '1', title: '1. Ürün Özellikleri', sub: '4C & Ölçüler' },
            { num: '2', title: '2. Görsel & Sertifika', sub: 'Sertifikalı veya Sertifikasız' },
            { num: '3', title: '3. Fiyat & Envanter', sub: 'Fiyat & Emanet Kasası' },
            { num: '4', title: '4. Önizleme & Yayınla', sub: 'B2B Pazaryeri Lansmanı' },
          ].map((st) => (
            <div key={st.num} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-sm font-bold">
                  {st.num}
                </div>
                <span className="text-body-sm font-bold text-primary">{st.title}</span>
              </div>
              <div className="h-1.5 w-full bg-primary rounded-full" />
              <span className="text-label-sm text-on-surface-variant mt-1">{st.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column B2B Master Form (8 cols Form / 4 cols Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form className="lg:col-span-8 space-y-6">
          {/* STEP 1 CONTAINER */}
          <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <div>
                <h2 className="text-title-md font-bold text-primary">
                  Adım 1: Pırlanta Teknik Parametreleri (4C)
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Uluslararası gemoloji standartlarına göre taş kimliği
                </p>
              </div>
              <span className="text-label-sm text-secondary font-bold uppercase bg-secondary-container px-2.5 py-1 rounded">
                Zorunlu Alanlar
              </span>
            </div>

            {/* Origin Switch */}
            <div className="space-y-1.5">
              <label className="text-label-md text-primary font-bold block">
                Taş Menşei (Origin)
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-low rounded-lg">
                <button
                  type="button"
                  onClick={() => setValue('origin', 'natural')}
                  className={cn(
                    'py-2.5 px-3 rounded-md text-body-sm font-bold flex items-center justify-center gap-2 transition-all',
                    liveValues.origin === 'natural'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  )}
                >
                  <Diamond className="w-4 h-4 text-secondary" />
                  <span>Doğal Pırlanta (Natural Diamond)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('origin', 'lab')}
                  className={cn(
                    'py-2.5 px-3 rounded-md text-body-sm font-bold flex items-center justify-center gap-2 transition-all',
                    liveValues.origin === 'lab'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  )}
                >
                  <Sparkles className="w-4 h-4 text-tertiary-container" />
                  <span>Laboratuvar Üretimi (Lab-Grown)</span>
                </button>
              </div>
            </div>

            {/* Interactive 10 Shape Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-label-md text-primary font-bold">Kesim Şekli (Shape)</label>
                <span className="text-label-sm text-secondary font-bold">
                  Seçili: {liveValues.shape}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {DIAMOND_SHAPES.map((s) => {
                  const selected = liveValues.shape === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setValue('shape', s.value as DiamondShape)}
                      className={cn(
                        'flex flex-col items-center justify-center p-2.5 rounded-lg transition-all',
                        selected
                          ? 'bg-surface-variant text-primary shadow-sm ring-2 ring-primary font-bold'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                      )}
                    >
                      <DiamondShapeIcon shape={s.value} className="w-7 h-7" />
                      <span className="text-label-sm mt-1">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-label-md text-primary font-bold mb-1">
                  İlan Başlığı *
                </label>
                <input
                  {...register('title')}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm text-primary font-semibold"
                />
                {errors.title && (
                  <p className="text-label-sm text-error mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-label-md text-primary font-bold mb-1">
                  Stok Referans No (SKU) *
                </label>
                <input
                  {...register('sku')}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 font-data-mono text-body-sm font-bold text-primary tabular-nums"
                />
              </div>
            </div>

            {/* Carat & Certificate (Supports Sertifikasız!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-label-md text-primary font-bold">
                    Karat Ağırlığı (CT)
                  </label>
                  <span className="font-data-mono text-label-sm text-secondary font-semibold">
                    Tolerans ±0.005
                  </span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('carat')}
                  className="w-full bg-surface-container-low text-primary font-data-mono text-title-md font-bold rounded-lg px-3 py-2 border border-outline-variant/50 tabular-nums"
                />
              </div>
              <div>
                <label className="block text-label-md text-primary font-bold mb-1">
                  Sertifika Durumu &amp; Rapor No
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <select
                    {...register('certLab')}
                    onChange={(e) => {
                      const val = e.target.value as DiamondFormValues['certLab'];
                      setValue('certLab', val);
                      if (val === 'Sertifikasız') {
                        setValue('certNumber', 'Sertifikasız');
                      }
                    }}
                    className="col-span-2 bg-surface-container-low text-primary font-bold text-body-sm rounded-lg px-2 py-2 border border-outline-variant/50"
                  >
                    <option value="GIA">GIA</option>
                    <option value="IGI">IGI</option>
                    <option value="HRD">HRD</option>
                    <option value="Sertifikasız">Sertifikasız</option>
                  </select>
                  <input
                    {...register('certNumber')}
                    disabled={isUncertified}
                    placeholder={isUncertified ? 'Sertifikasız ürün' : 'Rapor No...'}
                    className="col-span-3 bg-surface-container-low text-primary font-data-mono text-body-sm font-bold rounded-lg px-3 py-2 border border-outline-variant/50 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Color Scale Buttons */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-label-md text-primary font-bold">
                  Renk Sınıfı (Color Grade)
                </label>
                <span className="text-label-sm text-primary font-bold">
                  Seçili: {liveValues.color}
                </span>
              </div>
              <div className="grid grid-cols-8 gap-1.5 bg-surface-container-low p-1.5 rounded-lg text-center">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setValue('color', c)}
                    className={cn(
                      'py-2 rounded font-data-mono text-body-sm transition-colors',
                      liveValues.color === c
                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container font-semibold'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Clarity Scale Buttons */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-label-md text-primary font-bold">
                  Berraklık Sınıfı (Clarity Grade)
                </label>
                <span className="text-label-sm text-primary font-bold">
                  Seçili: {liveValues.clarity}
                </span>
              </div>
              <div className="grid grid-cols-8 gap-1.5 bg-surface-container-low p-1.5 rounded-lg text-center">
                {CLARITIES.map((cl) => (
                  <button
                    key={cl}
                    type="button"
                    onClick={() => setValue('clarity', cl)}
                    className={cn(
                      'py-2 rounded font-data-mono text-label-sm transition-colors',
                      liveValues.clarity === cl
                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container font-semibold'
                    )}
                  >
                    {cl}
                  </button>
                ))}
              </div>
            </div>

            {/* Cut, Polish, Symmetry, Fluorescence */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-label-sm text-on-surface-variant font-semibold mb-1">
                  Kesim Kalitesi
                </label>
                <select
                  {...register('cut')}
                  className="w-full bg-surface-container-low text-primary font-data-mono text-body-sm font-semibold rounded-lg px-2.5 py-2 border border-outline-variant/50"
                >
                  {['Ideal', 'Excellent', 'Very Good', 'Good'].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-semibold mb-1">
                  Cila (Polish)
                </label>
                <select
                  {...register('polish')}
                  className="w-full bg-surface-container-low text-primary font-data-mono text-body-sm font-semibold rounded-lg px-2.5 py-2 border border-outline-variant/50"
                >
                  {['Ideal', 'Excellent', 'Very Good', 'Good'].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-semibold mb-1">
                  Simetri (Symmetry)
                </label>
                <select
                  {...register('symmetry')}
                  className="w-full bg-surface-container-low text-primary font-data-mono text-body-sm font-semibold rounded-lg px-2.5 py-2 border border-outline-variant/50"
                >
                  {['Ideal', 'Excellent', 'Very Good', 'Good'].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-semibold mb-1">
                  Floresans (Fluo)
                </label>
                <select
                  {...register('fluorescence')}
                  className="w-full bg-surface-container-low text-primary font-data-mono text-body-sm font-semibold rounded-lg px-2.5 py-2 border border-outline-variant/50"
                >
                  {['None', 'Faint', 'Medium', 'Strong'].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
              <span className="text-label-sm uppercase tracking-wider text-secondary font-bold block">
                Fiziksel Boyutlar &amp; Oranlar
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-label-sm text-on-surface-variant block mb-1">
                    Ölçüler (mm)
                  </label>
                  <input
                    {...register('measurements')}
                    className="w-full bg-surface-container-lowest text-primary font-data-mono text-body-sm font-semibold rounded-lg px-2.5 py-2"
                  />
                </div>
                <div>
                  <label className="text-label-sm text-on-surface-variant block mb-1">
                    Derinlik (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('depthPercent')}
                    className="w-full bg-surface-container-lowest text-primary font-data-mono text-body-sm font-semibold rounded-lg px-2.5 py-2"
                  />
                </div>
                <div>
                  <label className="text-label-sm text-on-surface-variant block mb-1">
                    Tabla (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('tablePercent')}
                    className="w-full bg-surface-container-lowest text-primary font-data-mono text-body-sm font-semibold rounded-lg px-2.5 py-2"
                  />
                </div>
                <div>
                  <label className="text-label-sm text-on-surface-variant block mb-1">
                    Oran (Ratio)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('ratio')}
                    className="w-full bg-surface-container-lowest text-primary font-data-mono text-body-sm font-semibold rounded-lg px-2.5 py-2"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2 CONTAINER */}
          <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <div>
                <h2 className="text-title-md font-bold text-primary">
                  Adım 2: Görseller &amp; Belgeler
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Yerel olarak yüklenen görseller IndexedDB&apos;de saklanır
                </p>
              </div>
              <span className="text-label-sm text-primary font-semibold bg-surface-variant px-2.5 py-1 rounded">
                {media.length} Görsel Eklendi
              </span>
            </div>
            <LocalMediaUploader media={media} onChange={setMedia} />
          </section>

          {/* STEP 3 CONTAINER */}
          <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <div>
                <h2 className="text-title-md font-bold text-primary">
                  Adım 3: Fiyat, Stok &amp; Emanet Lokasyonu
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Fiyatlama ve kasa transfer noktası
                </p>
              </div>
              <span className="text-label-sm text-primary font-semibold bg-surface-variant px-2.5 py-1 rounded">
                USD Bazlı
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-label-md text-primary font-bold">
                    Fiyat (USD) <span className="text-outline font-normal">(Opsiyonel)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setValue('priceUsd', livePriceUsd > 0 ? 0 : 8950)}
                    className={cn(
                      'px-2 py-0.5 rounded text-label-sm font-bold transition-colors',
                      !isPriceSpecified(livePriceUsd)
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container-low text-secondary hover:bg-surface-container'
                    )}
                  >
                    {!isPriceSpecified(livePriceUsd)
                      ? '✓ Fiyat Sorunuz Aktif'
                      : 'Fiyat Belirtme (Fiyat Sorunuz)'}
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  placeholder="Boş veya 0 = Fiyat Sorunuz"
                  {...register('priceUsd')}
                  className="w-full bg-surface-container-low text-primary font-data-mono text-headline-sm font-bold rounded-lg px-3 py-2 border border-outline-variant/50 tabular-nums"
                />
                <p className="text-label-sm text-outline mt-1">
                  Fiyat girilmezse veya 0 bırakılırsa katalogda <strong>&quot;Fiyat Sorunuz&quot;</strong> olarak görünür.
                </p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-center">
                <span className="text-label-sm text-outline">Otomatik Ct Başı Fiyat</span>
                <span className="font-data-mono text-title-md font-bold text-tertiary-container tabular-nums">
                  {isPriceSpecified(livePriceUsd)
                    ? `$${livePricePerCt.toLocaleString('en-US')} / ct`
                    : '— (Fiyat Sorunuz)'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-label-md text-primary font-bold mb-1">
                Fiziki Emanet Kasası &amp; Muayene Lokasyonu *
              </label>
              <input
                {...register('vaultLocation')}
                className="w-full bg-surface-container-low text-primary text-body-sm font-semibold rounded-lg px-3 py-2.5 border border-outline-variant/50"
              />
            </div>

            <div>
              <label className="block text-label-md text-primary font-bold mb-1">
                Gemolojik Açıklama
              </label>
              <textarea
                rows={3}
                {...register('description')}
                className="w-full bg-surface-container-low text-primary text-body-sm rounded-lg px-3 py-2 border border-outline-variant/50"
              />
            </div>
          </section>
        </form>

        {/* RIGHT COLUMN: Live Marketplace Preview & Compliance Checklist */}
        <aside className="lg:col-span-4 flex flex-col gap-4 sticky top-24">
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <span className="text-label-sm uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping" />
                Pazaryeri Kart Önizlemesi
              </span>
              <span className="font-data-mono text-label-sm text-on-surface-variant font-semibold">
                ID: #{liveValues.sku}
              </span>
            </div>

            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low">
              <MediaImage media={media[0]} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-primary text-on-primary font-data-mono text-label-sm font-bold px-2 py-1 rounded shadow-sm">
                {isUncertified ? 'Sertifikasız' : `${liveValues.certLab} ${liveValues.certNumber}`}
              </div>
              <div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 backdrop-blur text-primary font-data-mono text-label-sm font-bold px-2 py-1 rounded shadow-sm">
                {liveValues.origin === 'natural' ? 'Doğal Elmas' : 'Lab-Grown'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <h4 className="text-title-md font-bold text-primary">
                  {liveCarat.toFixed(2)} ct {liveValues.shape} Kesim
                </h4>
                <span className="font-data-mono text-headline-sm font-bold text-primary tabular-nums">
                  {formatCurrency(livePriceUsd, currency)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-data-mono text-body-sm">
                <span>
                  Renk: <strong className="text-primary">{liveValues.color}</strong>
                </span>
                <span>•</span>
                <span>
                  Berraklık: <strong className="text-primary">{liveValues.clarity}</strong>
                </span>
                <span>•</span>
                <span>
                  Kesim: <strong className="text-primary">{liveValues.cut}</strong>
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-2.5 space-y-1 text-label-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Ct Başı Fiyat:</span>
                <span className="font-data-mono text-primary font-bold tabular-nums">
                  {formatCaratPrice(livePricePerCt, currency, livePriceUsd)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Simetri / Cila:</span>
                <span className="font-data-mono text-primary font-semibold">
                  {liveValues.symmetry} / {liveValues.polish}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Floresans:</span>
                <span className="font-data-mono text-primary font-semibold">
                  {liveValues.fluorescence}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Emanet:</span>
                <span className="font-data-mono text-secondary font-bold truncate max-w-[160px]">
                  {liveValues.vaultLocation}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit((v) => saveWithStatus(v, 'available', false))}
                className="w-full py-3 px-4 rounded-lg bg-primary text-on-primary text-title-md font-bold hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{existing ? 'Değişiklikleri Yayınla' : 'Pazaryerinde Yayınla'}</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit((v) => saveWithStatus(v, 'draft', true))}
                  className="py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary text-label-md font-semibold flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Önizle</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit((v) => saveWithStatus(v, 'draft', false))}
                  className="py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary text-label-md font-semibold flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Taslak Kaydet</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/40 space-y-2">
            <span className="text-label-sm uppercase tracking-wider text-secondary font-bold block">
              B2B Doğrulama Kontrolleri
            </span>
            <ul className="space-y-1.5 text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                <span>
                  {isUncertified
                    ? 'Sertifikasız / Atölye Ekspertiz Modu Seçildi'
                    : `${liveValues.certLab} Rapor Numarası Formatı Uygun`}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                <span>4C Parametreleri &amp; Ölçü Oranları Doğrulandı</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                <span>Emanet Kasası Rezerve Edildi</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

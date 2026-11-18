import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Heart,
  Scale,
  X,
  Diamond,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  Verified,
} from 'lucide-react';
import { listingRepository } from '@/repositories';
import type {
  DiamondCertLab,
  DiamondClarity,
  DiamondColor,
  DiamondCut,
  DiamondFilterParams,
  DiamondFluorescence,
  DiamondOrigin,
  DiamondShape,
} from '@/domain/types';
import { DIAMOND_SHAPES, DiamondShapeIcon } from '@/components/common/DiamondShapeIcon';
import { DualRangeSlider } from '@/components/common/DualRangeSlider';
import { DiamondCard } from '@/components/marketplace/DiamondCard';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  cn,
  EUR_TRY_RATE,
  formatCaratPrice,
  formatCurrency,
  GOLD_GRAM_TRY,
  isPriceSpecified,
  USD_TRY_RATE,
} from '@/lib/utils';

const COLORS: DiamondColor[] = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const CLARITIES: DiamondClarity[] = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
const CUTS: DiamondCut[] = ['Ideal', 'Excellent', 'Very Good', 'Good'];
const POLISH_SYM_OPTIONS: { label: string; value: DiamondCut }[] = [
  { label: 'EX', value: 'Excellent' },
  { label: 'VG', value: 'Very Good' },
  { label: 'GD', value: 'Good' },
];
const FLUOR_OPTIONS: { label: string; value: DiamondFluorescence }[] = [
  { label: 'None', value: 'None' },
  { label: 'Fnt', value: 'Faint' },
  { label: 'Med', value: 'Medium' },
  { label: 'Str', value: 'Strong' },
];
const CERTS: DiamondCertLab[] = ['GIA', 'IGI', 'HRD', 'Sertifikasız'];

const CARAT_MIN_BOUND = 0.3;
const CARAT_MAX_BOUND = 10.0;
const PRICE_MIN_BOUND = 500;
const PRICE_MAX_BOUND = 50000;

function parseCsv<T extends string>(val: string | null): T[] {
  if (!val) return [];
  return val.split(',').filter(Boolean) as T[];
}

export function DiamondCatalogPage({ isSearchMode = false }: { isSearchMode?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // Default view mode is 'table' (Liste görünümü) per user requirement
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const { currency, setCurrency, isFavorite, toggleFavorite, isCompared, toggleCompare, compareIds } =
    useMarketplace();

  const filters: DiamondFilterParams = useMemo(() => {
    const originParam = searchParams.get('origin');
    const origin: DiamondOrigin | 'all' =
      originParam === 'natural' || originParam === 'lab' ? originParam : 'all';

    return {
      search: searchParams.get('q') || '',
      origin,
      shapes: parseCsv<DiamondShape>(searchParams.get('shape')),
      colors: parseCsv<DiamondColor>(searchParams.get('color')),
      clarities: parseCsv<DiamondClarity>(searchParams.get('clarity')),
      cuts: parseCsv<DiamondCut>(searchParams.get('cut')),
      polishes: parseCsv<DiamondCut>(searchParams.get('polish')),
      symmetries: parseCsv<DiamondCut>(searchParams.get('symmetry')),
      fluorescences: parseCsv<DiamondFluorescence>(searchParams.get('fluor')),
      certLabs: parseCsv<DiamondCertLab>(searchParams.get('cert')),
      vaultLocation: searchParams.get('vault') || undefined,
      caratMin: searchParams.get('caratMin') ? Number(searchParams.get('caratMin')) : undefined,
      caratMax: searchParams.get('caratMax') ? Number(searchParams.get('caratMax')) : undefined,
      priceMinUsd: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMaxUsd: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      sortBy: (searchParams.get('sort') as DiamondFilterParams['sortBy']) || 'newest',
    };
  }, [searchParams]);

  const { data: diamonds = [], isLoading } = useQuery({
    queryKey: ['diamonds', filters],
    queryFn: () => listingRepository.getDiamonds(filters),
  });

  const { data: allDiamonds = [] } = useQuery({
    queryKey: ['diamonds', 'counts'],
    queryFn: () => listingRepository.getDiamonds({}),
  });

  const naturalTotal = allDiamonds.filter((d) => d.origin === 'natural').length;
  const labTotal = allDiamonds.filter((d) => d.origin === 'lab').length;

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const updateMultiParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(updates)) {
      if (!v) next.delete(k);
      else next.set(k, v);
    }
    setSearchParams(next, { replace: true });
  };

  const toggleArrayParam = (key: string, item: string, current: string[] = []) => {
    const exists = current.includes(item);
    const updated = exists ? current.filter((x) => x !== item) : [...current, item];
    updateParam(key, updated.length > 0 ? updated.join(',') : undefined);
  };

  const resetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const selectAllShapes = () => {
    if (filters.shapes?.length === DIAMOND_SHAPES.length) {
      updateParam('shape', undefined);
    } else {
      updateParam('shape', DIAMOND_SHAPES.map((s) => s.value).join(','));
    }
  };

  const currentCaratMin = filters.caratMin ?? CARAT_MIN_BOUND;
  const currentCaratMax = filters.caratMax ?? CARAT_MAX_BOUND;
  const currentPriceMin = filters.priceMinUsd ?? PRICE_MIN_BOUND;
  const currentPriceMax = filters.priceMaxUsd ?? PRICE_MAX_BOUND;

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Daily Exchange Rates Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-on-surface-variant text-label-sm">
        <div className="flex items-center gap-1.5">
          <Link to="/" className="hover:text-primary transition-colors">
            Ana Sayfa
          </Link>
          <span className="text-outline">/</span>
          <span className="text-primary font-semibold">
            {isSearchMode ? 'Detaylı Pırlanta Arama' : 'Pırlantaları Keşfet'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 font-data-mono tabular-nums">
          <span>
            USD/TRY: <strong className="text-primary">{USD_TRY_RATE.toFixed(2)} ₺</strong>
          </span>
          <span>·</span>
          <span>
            EUR/TRY: <strong className="text-primary">{EUR_TRY_RATE.toFixed(2)} ₺</strong>
          </span>
          <span>·</span>
          <span>
            Has Altın (Gr):{' '}
            <strong className="text-secondary">{GOLD_GRAM_TRY.toLocaleString('tr-TR')} ₺</strong>
          </span>
        </div>
      </div>

      {/* Main Headline + Segmented Origin Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-label-sm uppercase tracking-wider font-semibold">
              Gemolojik B2B Borsası
            </span>
          </div>
          <h1 className="text-headline-lg-mobile sm:text-headline-lg text-primary tracking-tight">
            {isSearchMode ? 'Detaylı Pırlanta Arama' : 'Pırlantaları Keşfet'}
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1 max-w-3xl">
            İhtiyacınıza uygun pırlantayı 4C standartları, GIA/IGI/HRD sertifikaları veya sertifikasız seçenekleriyle hassas şekilde filtreleyin.
          </p>
        </div>

        {/* Segmented Origin Toggle */}
        <div className="flex flex-wrap items-center self-start lg:self-auto bg-surface-container-low p-1 rounded-xl shadow-sm border border-outline-variant/40">
          <button
            type="button"
            onClick={() => updateParam('origin', undefined)}
            className={cn(
              'px-3.5 py-2 rounded-lg text-body-sm font-semibold transition-all',
              filters.origin === 'all'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            )}
          >
            Tümü ({allDiamonds.length})
          </button>
          <button
            type="button"
            onClick={() => updateParam('origin', 'natural')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-body-sm font-semibold transition-all',
              filters.origin === 'natural'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            )}
          >
            <Diamond className="w-4 h-4 text-secondary" />
            <span>Doğal Pırlantalar</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-primary text-label-sm tabular-nums">
              {naturalTotal}
            </span>
          </button>
          <button
            type="button"
            onClick={() => updateParam('origin', 'lab')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-body-sm font-semibold transition-all',
              filters.origin === 'lab'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            )}
          >
            <Sparkles className="w-4 h-4 text-tertiary-container" />
            <span>Laboratuvar Pırlantaları</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm tabular-nums">
              {labTotal}
            </span>
          </button>
        </div>
      </div>

      {/* 10 Interactive Vector Shape Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-label-md uppercase tracking-wider text-primary">
              Pırlanta Kesim Formu
            </span>
            <span className="text-outline text-label-sm">(Çoklu seçim yapılabilir)</span>
          </div>
          <button
            type="button"
            onClick={selectAllShapes}
            className="text-primary hover:text-primary-container text-label-sm underline transition-colors"
          >
            {filters.shapes?.length === DIAMOND_SHAPES.length
              ? 'Form Seçimini Temizle'
              : 'Tüm Formları Seç'}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {DIAMOND_SHAPES.map((s) => {
            const active = filters.shapes?.includes(s.value);
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleArrayParam('shape', s.value, filters.shapes)}
                className={cn(
                  'group flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center',
                  active
                    ? 'bg-primary-container/10 border-primary text-primary shadow-sm'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/40 text-on-surface-variant'
                )}
              >
                <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <DiamondShapeIcon shape={s.value} className="w-7 h-7" />
                </div>
                <span className="mt-1.5 text-body-sm font-semibold text-primary leading-tight">
                  {s.label}
                </span>
                <span className="text-label-sm text-outline">{s.value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRIMARY FILTER ENGINE */}
      <section className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/40 p-5 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
          {/* Filter 1: Carat (Interactive DualRangeSlider + Inputs) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-label-md uppercase tracking-wider text-primary font-semibold">
                1. Karat Aralığı (ct)
              </label>
              <span className="font-data-mono text-data-mono text-primary font-medium tabular-nums">
                {currentCaratMin.toFixed(2)} ct — {currentCaratMax.toFixed(2)} ct
              </span>
            </div>
            <p className="text-body-sm text-outline">Slider veya kutucuklarla karat aralığı seçin</p>
            <DualRangeSlider
              min={CARAT_MIN_BOUND}
              max={CARAT_MAX_BOUND}
              step={0.05}
              valueMin={currentCaratMin}
              valueMax={currentCaratMax}
              onChange={(nextMin, nextMax) =>
                updateMultiParams({
                  caratMin: nextMin <= CARAT_MIN_BOUND ? undefined : String(nextMin),
                  caratMax: nextMax >= CARAT_MAX_BOUND ? undefined : String(nextMax),
                })
              }
            />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <span className="text-label-sm text-outline">Min</span>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  placeholder="0.30"
                  value={filters.caratMin ?? ''}
                  onChange={(e) => updateParam('caratMin', e.target.value || undefined)}
                  className="w-16 bg-transparent text-right font-data-mono text-data-mono text-primary font-bold focus:outline-none tabular-nums"
                />
                <span className="text-body-sm text-outline ml-1">ct</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <span className="text-label-sm text-outline">Maks</span>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  placeholder="10.00"
                  value={filters.caratMax ?? ''}
                  onChange={(e) => updateParam('caratMax', e.target.value || undefined)}
                  className="w-16 bg-transparent text-right font-data-mono text-data-mono text-primary font-bold focus:outline-none tabular-nums"
                />
                <span className="text-body-sm text-outline ml-1">ct</span>
              </div>
            </div>
          </div>

          {/* Filter 2: Price (Interactive DualRangeSlider + Inputs) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-label-md uppercase tracking-wider text-primary font-semibold">
                  2. Fiyat
                </label>
                <div className="flex items-center bg-surface-container p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={cn(
                      'px-1.5 py-0.5 rounded text-label-sm font-bold',
                      currency === 'USD'
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant'
                    )}
                  >
                    $
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('TRY')}
                    className={cn(
                      'px-1.5 py-0.5 rounded text-label-sm font-bold',
                      currency === 'TRY'
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant'
                    )}
                  >
                    ₺
                  </button>
                </div>
              </div>
              <span className="font-data-mono text-data-mono text-primary font-medium tabular-nums">
                ${currentPriceMin.toLocaleString('tr-TR')} — ${currentPriceMax.toLocaleString('tr-TR')}
              </span>
            </div>
            <p className="text-body-sm text-outline">KDV hariç fiyat aralığı (USD)</p>
            <DualRangeSlider
              min={PRICE_MIN_BOUND}
              max={PRICE_MAX_BOUND}
              step={250}
              valueMin={currentPriceMin}
              valueMax={currentPriceMax}
              onChange={(nextMin, nextMax) =>
                updateMultiParams({
                  priceMin: nextMin <= PRICE_MIN_BOUND ? undefined : String(nextMin),
                  priceMax: nextMax >= PRICE_MAX_BOUND ? undefined : String(nextMax),
                })
              }
            />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <span className="text-label-sm text-outline">$</span>
                <input
                  type="number"
                  step="100"
                  min="0"
                  placeholder="500"
                  value={filters.priceMinUsd ?? ''}
                  onChange={(e) => updateParam('priceMin', e.target.value || undefined)}
                  className="w-20 bg-transparent text-right font-data-mono text-data-mono text-primary font-bold focus:outline-none tabular-nums"
                />
                <span className="text-body-sm text-outline ml-1">USD</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <span className="text-label-sm text-outline">$</span>
                <input
                  type="number"
                  step="100"
                  min="0"
                  placeholder="50000"
                  value={filters.priceMaxUsd ?? ''}
                  onChange={(e) => updateParam('priceMax', e.target.value || undefined)}
                  className="w-20 bg-transparent text-right font-data-mono text-data-mono text-primary font-bold focus:outline-none tabular-nums"
                />
                <span className="text-body-sm text-outline ml-1">USD</span>
              </div>
            </div>
          </div>

          {/* Filter 3: Certificate Lab & SKU Search */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-label-md uppercase tracking-wider text-primary font-semibold">
                3. Sertifika Durumu &amp; Kod
              </label>
              <span className="text-tertiary-container text-label-sm flex items-center gap-1 font-semibold">
                <Verified className="w-3.5 h-3.5" /> Sertifikalı &amp; Sertifikasız
              </span>
            </div>
            <p className="text-body-sm text-outline">GIA, IGI, HRD veya Sertifikasız taşlar</p>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {CERTS.map((cert) => {
                const active = filters.certLabs?.includes(cert);
                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleArrayParam('cert', cert, filters.certLabs)}
                    className={cn(
                      'py-2 px-1 rounded-lg text-label-sm font-bold text-center transition-colors truncate',
                      active
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                    )}
                  >
                    {cert}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => updateParam('cert', undefined)}
                className={cn(
                  'py-2 rounded-lg text-label-sm font-bold text-center transition-colors',
                  !filters.certLabs || filters.certLabs.length === 0
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                )}
              >
                Tümü
              </button>
            </div>
            <div className="flex items-center bg-surface-container-low border border-outline-variant/40 rounded-lg px-2.5 py-1.5 mt-1">
              <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => updateParam('q', e.target.value || undefined)}
                placeholder="Taş No veya Sertifika No ara (Örn: D-10482)..."
                className="w-full bg-transparent text-body-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Filter 4: Color */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-label-md uppercase tracking-wider text-primary font-semibold">
                4. Renk Derecesi (Color)
              </label>
              <span className="text-label-sm text-secondary font-bold">D — K Skalası</span>
            </div>
            <div className="grid grid-cols-8 gap-1 pt-1">
              {COLORS.map((c) => {
                const active = filters.colors?.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleArrayParam('color', c, filters.colors)}
                    className={cn(
                      'py-1.5 rounded font-data-mono text-data-mono transition-colors',
                      active
                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-label-sm text-outline px-1">
              <span>Colorless (Renksiz)</span>
              <span>Near Colorless</span>
            </div>
          </div>

          {/* Filter 5: Clarity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-label-md uppercase tracking-wider text-primary font-semibold">
                5. Berraklık (Clarity)
              </label>
              <span className="text-label-sm text-secondary font-bold">FL — SI2</span>
            </div>
            <div className="grid grid-cols-8 gap-1 pt-1">
              {CLARITIES.map((cl) => {
                const active = filters.clarities?.includes(cl);
                return (
                  <button
                    key={cl}
                    type="button"
                    onClick={() => toggleArrayParam('clarity', cl, filters.clarities)}
                    className={cn(
                      'py-1.5 rounded font-data-mono text-[11px] transition-colors',
                      active
                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    )}
                  >
                    {cl}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-label-sm text-outline px-1">
              <span>Flawless</span>
              <span>Very Slightly Included</span>
            </div>
          </div>

          {/* Filter 6: Cut */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-label-md uppercase tracking-wider text-primary font-semibold">
                6. Kesim Kalitesi (Cut)
              </label>
              <span className="text-label-sm text-secondary font-bold">Ideal &amp; 3X Excellent</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {CUTS.map((cut) => {
                const active = filters.cuts?.includes(cut);
                return (
                  <button
                    key={cut}
                    type="button"
                    onClick={() => toggleArrayParam('cut', cut, filters.cuts)}
                    className={cn(
                      'py-2 rounded-lg text-label-md font-semibold text-center transition-colors',
                      active
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                    )}
                  >
                    {cut}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-label-sm text-outline px-1">
              <span>Maksimum Işık Kırılması</span>
              <span>Standart Ticari</span>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Gemological Parameters (Interactive) */}
        <div className="mt-6 bg-surface-container-low rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span className="text-title-md text-primary font-bold">
                Gelişmiş Gemolojik Kriterler &amp; Fiziksel Konum
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="text-primary hover:text-primary-container text-label-md flex items-center gap-1"
            >
              <span>{advancedOpen ? 'Daralt' : 'Genişlet'}</span>
              {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {advancedOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-outline-variant/40">
              <div>
                <span className="block text-label-sm uppercase text-outline mb-1">Cila (Polish)</span>
                <div className="flex bg-surface-container-lowest p-1 rounded-lg gap-1">
                  {POLISH_SYM_OPTIONS.map((opt) => {
                    const active = filters.polishes?.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleArrayParam('polish', opt.value, filters.polishes)}
                        className={cn(
                          'flex-1 py-1 text-center rounded text-label-sm font-bold transition-colors',
                          active
                            ? 'bg-primary text-on-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="block text-label-sm uppercase text-outline mb-1">
                  Simetri (Symmetry)
                </span>
                <div className="flex bg-surface-container-lowest p-1 rounded-lg gap-1">
                  {POLISH_SYM_OPTIONS.map((opt) => {
                    const active = filters.symmetries?.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleArrayParam('symmetry', opt.value, filters.symmetries)}
                        className={cn(
                          'flex-1 py-1 text-center rounded text-label-sm font-bold transition-colors',
                          active
                            ? 'bg-primary text-on-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="block text-label-sm uppercase text-outline mb-1">Floresans</span>
                <div className="flex bg-surface-container-lowest p-1 rounded-lg gap-1">
                  {FLUOR_OPTIONS.map((opt) => {
                    const active = filters.fluorescences?.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleArrayParam('fluor', opt.value, filters.fluorescences)}
                        className={cn(
                          'flex-1 py-1 text-center rounded text-label-sm font-bold transition-colors',
                          active
                            ? 'bg-primary text-on-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="block text-label-sm uppercase text-outline mb-1">Kasa / Konum</span>
                <select
                  value={filters.vaultLocation || ''}
                  onChange={(e) => updateParam('vault', e.target.value || undefined)}
                  className="w-full bg-surface-container-lowest py-1.5 px-2 rounded-lg text-body-sm text-primary font-medium focus:outline-none"
                >
                  <option value="">Tüm İstanbul &amp; İzmir</option>
                  <option value="Kapalıçarşı">Kapalıçarşı Emanet Kasa</option>
                  <option value="Kuyumcukent">Kuyumcukent Merkez Kasa</option>
                  <option value="İzmir">İzmir Kemeraltı Kasa</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter Summary Strip & Catalog View Switcher Toolbar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-headline-sm text-primary font-bold mr-2 tabular-nums">
            {diamonds.length} Pırlanta
          </span>

          {filters.origin && filters.origin !== 'all' && (
            <button
              type="button"
              onClick={() => updateParam('origin', undefined)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary text-body-sm font-semibold hover:bg-error-container"
            >
              <span>{filters.origin === 'natural' ? 'Doğal' : 'Laboratuvar'}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {filters.shapes?.map((sh) => (
            <button
              key={sh}
              type="button"
              onClick={() => toggleArrayParam('shape', sh, filters.shapes)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary text-body-sm font-semibold"
            >
              <span>{sh}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ))}

          {filters.colors?.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => toggleArrayParam('color', col, filters.colors)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary text-body-sm font-semibold"
            >
              <span>{col} Renk</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ))}

          {filters.clarities?.map((cl) => (
            <button
              key={cl}
              type="button"
              onClick={() => toggleArrayParam('clarity', cl, filters.clarities)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary text-body-sm font-semibold"
            >
              <span>{cl}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ))}

          {filters.certLabs?.map((lab) => (
            <button
              key={lab}
              type="button"
              onClick={() => toggleArrayParam('cert', lab, filters.certLabs)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary text-body-sm font-semibold"
            >
              <span>{lab}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ))}

          <button
            type="button"
            onClick={resetFilters}
            className="text-error hover:underline text-label-md ml-1 transition-colors"
          >
            Tüm Filtreleri Temizle
          </button>

          {compareIds.length > 0 && (
            <Link
              to="/karsilastir"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-bold"
            >
              <Scale className="w-3.5 h-3.5" />
              Karşılaştır ({compareIds.length})
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Table (Default) / Grid View Switcher */}
          <div className="flex items-center bg-surface-container p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded text-label-md font-semibold transition-all',
                viewMode === 'table'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              <TableIcon className="w-4 h-4" />
              <span>Liste Görünümü</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded text-label-md font-semibold transition-all',
                viewMode === 'grid'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Vitrin Kart</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="hidden lg:inline text-label-sm text-outline">Sıralama:</label>
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 px-3 py-1.5 rounded-lg text-body-sm text-primary font-medium focus:outline-none"
            >
              <option value="newest">Önerilen Sıralama (En Yeni)</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="carat-desc">Karat: Azalan (Büyük Taşlar)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 rounded-xl bg-surface-container-low animate-pulse" />
          ))}
        </div>
      ) : diamonds.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-12 text-center space-y-3">
          <p className="text-title-md text-primary">Seçilen kriterlere uygun pırlanta bulunamadı.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md"
          >
            Tüm Filtreleri Temizle
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {diamonds.map((d) => (
            <DiamondCard key={d.id} diamond={d} />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/50 text-label-sm uppercase tracking-wider text-outline">
                  <th className="py-3 px-4 sticky left-0 bg-surface-container-low z-10">Taş No</th>
                  <th className="py-3 px-3">Menşei</th>
                  <th className="py-3 px-3">Kesim</th>
                  <th className="py-3 px-3">Karat</th>
                  <th className="py-3 px-3">Renk</th>
                  <th className="py-3 px-3">Berraklık</th>
                  <th className="py-3 px-3">Cut / Pol / Sym</th>
                  <th className="py-3 px-3">Sertifika</th>
                  <th className="py-3 px-3">Ct Başı Fiyat</th>
                  <th className="py-3 px-3">Fiyat</th>
                  <th className="py-3 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-body-sm tabular-nums">
                {diamonds.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-primary sticky left-0 bg-surface-container-lowest">
                      <Link to={`/pirlanta/${d.id}`} className="hover:underline">
                        {d.sku}
                      </Link>
                    </td>
                    <td className="py-3 px-3">{d.origin === 'natural' ? 'Doğal' : 'Lab'}</td>
                    <td className="py-3 px-3">{d.shape}</td>
                    <td className="py-3 px-3 font-bold text-primary">{d.carat.toFixed(2)} ct</td>
                    <td className="py-3 px-3 font-semibold">{d.color}</td>
                    <td className="py-3 px-3 font-semibold">{d.clarity}</td>
                    <td className="py-3 px-3 text-label-sm">
                      {d.cut} / {d.polish} / {d.symmetry}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-primary text-on-primary text-[11px] font-bold">
                        {d.certLab}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-on-surface-variant whitespace-nowrap">
                      {formatCaratPrice(d.pricePerCaratUsd, currency, d.priceUsd)}
                    </td>
                    <td className="py-3 px-3 font-bold text-primary whitespace-nowrap">
                      {isPriceSpecified(d.priceUsd) ? (
                        formatCurrency(d.priceUsd, currency)
                      ) : (
                        <Link
                          to={`/teklif-iste?listingId=${d.id}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded bg-secondary-fixed/50 text-secondary font-bold text-label-sm hover:bg-secondary-fixed transition-colors"
                        >
                          Fiyat Sorunuz
                        </Link>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(d.id)}
                          className={cn(
                            'p-1.5 rounded border',
                            isFavorite(d.id)
                              ? 'text-error border-error bg-error-container/30'
                              : 'text-outline border-outline-variant/50'
                          )}
                        >
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCompare(d.id)}
                          className={cn(
                            'p-1.5 rounded border',
                            isCompared(d.id)
                              ? 'text-primary border-primary bg-primary-fixed/40'
                              : 'text-outline border-outline-variant/50'
                          )}
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          to={`/pirlanta/${d.id}`}
                          className="px-2.5 py-1 rounded bg-primary-container text-on-primary text-label-sm font-semibold"
                        >
                          Detay
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

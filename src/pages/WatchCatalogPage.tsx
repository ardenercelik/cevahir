import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  Heart,
  Search,
  X,
  Watch,
  Store,
  ShieldCheck,
  Handshake,
  MapPin,
} from 'lucide-react';
import { listingRepository } from '@/repositories';
import type { WatchCondition, WatchFilterParams } from '@/domain/types';
import { DualRangeSlider } from '@/components/common/DualRangeSlider';
import { WatchCard } from '@/components/marketplace/WatchCard';
import { useMarketplace } from '@/context/MarketplaceContext';
import { cn, formatCurrency, isPriceSpecified } from '@/lib/utils';

const BRANDS = [
  'Rolex',
  'Audemars Piguet',
  'Patek Philippe',
  'Vacheron Constantin',
  'Richard Mille',
  'Cartier',
];

const COLLECTIONS = [
  'Submariner',
  'GMT-Master II',
  'Daytona',
  'Royal Oak',
  'Nautilus',
  'Aquanaut',
];

const CONDITIONS: WatchCondition[] = [
  'Sıfır / Etiketli',
  'Çok İyi (Kılcal Çiziksiz)',
  'İyi (Kullanılmış)',
  'Koleksiyonluk',
];

const CASE_SIZES = [36, 39, 40, 41, 42, 44];

const WATCH_PRICE_MIN_BOUND = 5000;
const WATCH_PRICE_MAX_BOUND = 150000;
const WATCH_YEAR_MIN_BOUND = 2015;
const WATCH_YEAR_MAX_BOUND = 2026;

function parseCsv<T extends string>(val: string | null): T[] {
  if (!val) return [];
  return val.split(',').filter(Boolean) as T[];
}

function parseNumberCsv(val: string | null): number[] {
  if (!val) return [];
  return val
    .split(',')
    .map((x) => Number(x))
    .filter((n) => !Number.isNaN(n) && n > 0);
}

export function WatchCatalogPage({ isSearchMode = false }: { isSearchMode?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // Default view mode is 'table' (Liste görünümü) per user requirement
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { currency, isFavorite, toggleFavorite } = useMarketplace();

  const filters: WatchFilterParams = useMemo(() => {
    return {
      search: searchParams.get('q') || '',
      brands: parseCsv<string>(searchParams.get('brand')),
      conditions: parseCsv<WatchCondition>(searchParams.get('condition')),
      caseDiameters: parseNumberCsv(searchParams.get('size')),
      yearMin: searchParams.get('yearMin') ? Number(searchParams.get('yearMin')) : undefined,
      yearMax: searchParams.get('yearMax') ? Number(searchParams.get('yearMax')) : undefined,
      priceMinUsd: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMaxUsd: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      hasBox: searchParams.get('box') === '1',
      hasPapers: searchParams.get('papers') === '1',
      sortBy: (searchParams.get('sort') as WatchFilterParams['sortBy']) || 'newest',
    };
  }, [searchParams]);

  const { data: watches = [], isLoading } = useQuery({
    queryKey: ['watches', filters],
    queryFn: () => listingRepository.getWatches(filters),
  });

  const { data: allWatches = [] } = useQuery({
    queryKey: ['watches', 'all-counts'],
    queryFn: () => listingRepository.getWatches({}),
  });

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

  const toggleSizeParam = (sz: number) => {
    const current = filters.caseDiameters || [];
    const exists = current.includes(sz);
    const updated = exists ? current.filter((x) => x !== sz) : [...current, sz];
    updateParam('size', updated.length > 0 ? updated.join(',') : undefined);
  };

  const resetFilters = () => setSearchParams({}, { replace: true });

  const currentPriceMin = filters.priceMinUsd ?? WATCH_PRICE_MIN_BOUND;
  const currentPriceMax = filters.priceMaxUsd ?? WATCH_PRICE_MAX_BOUND;
  const currentYearMin = filters.yearMin ?? WATCH_YEAR_MIN_BOUND;
  const currentYearMax = filters.yearMax ?? WATCH_YEAR_MAX_BOUND;

  const FilterPanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/40">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="text-title-md text-primary font-bold">Filtreleme</span>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-1 text-label-sm text-secondary hover:text-primary"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Tümünü Sıfırla
        </button>
      </div>

      {/* Search by Reference */}
      <div className="space-y-1">
        <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">
          Referans No / Model
        </label>
        <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-2 border border-outline-variant/40">
          <Search className="w-4 h-4 text-outline mr-1.5 shrink-0" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => updateParam('q', e.target.value || undefined)}
            placeholder="Ref. No (Örn: 126710, 5167A)..."
            className="w-full bg-transparent text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-label-md uppercase tracking-wider text-primary">Marka</span>
          <span className="text-label-sm text-outline">{BRANDS.length} Seçenek</span>
        </div>
        <div className="space-y-1.5">
          {BRANDS.map((brand) => {
            const active = filters.brands?.includes(brand);
            const count = allWatches.filter((w) => w.brand === brand).length;
            return (
              <label
                key={brand}
                className="flex items-center justify-between cursor-pointer text-body-sm text-on-surface hover:text-primary"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(active)}
                    onChange={() => toggleArrayParam('brand', brand, filters.brands)}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span>{brand}</span>
                </span>
                <span className="font-data-mono text-label-sm text-outline tabular-nums">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Collections Quick Chips */}
      <div className="space-y-2 pt-1">
        <span className="text-label-md uppercase tracking-wider text-primary block">
          Koleksiyon
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COLLECTIONS.map((col) => {
            const active = filters.search?.toLowerCase() === col.toLowerCase();
            return (
              <button
                key={col}
                type="button"
                onClick={() => updateParam('q', active ? undefined : col)}
                className={cn(
                  'px-2.5 py-1 rounded text-label-sm transition-colors',
                  active
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container text-primary hover:bg-surface-container-highest'
                )}
              >
                {col}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range with DualRangeSlider */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-label-md uppercase tracking-wider text-primary block">
            Fiyat ($)
          </span>
          <span className="font-data-mono text-label-sm text-primary font-semibold tabular-nums">
            ${currentPriceMin.toLocaleString('tr-TR')} — ${currentPriceMax.toLocaleString('tr-TR')}
          </span>
        </div>
        <DualRangeSlider
          min={WATCH_PRICE_MIN_BOUND}
          max={WATCH_PRICE_MAX_BOUND}
          step={1000}
          valueMin={currentPriceMin}
          valueMax={currentPriceMax}
          onChange={(nextMin, nextMax) =>
            updateMultiParams({
              priceMin: nextMin <= WATCH_PRICE_MIN_BOUND ? undefined : String(nextMin),
              priceMax: nextMax >= WATCH_PRICE_MAX_BOUND ? undefined : String(nextMax),
            })
          }
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-container-low px-2.5 py-1.5 rounded border border-outline-variant/40">
            <span className="text-[10px] text-outline block">Min ($)</span>
            <input
              type="number"
              placeholder="5000"
              value={filters.priceMinUsd ?? ''}
              onChange={(e) => updateParam('priceMin', e.target.value || undefined)}
              className="w-full bg-transparent font-data-mono text-body-sm font-semibold text-primary focus:outline-none tabular-nums"
            />
          </div>
          <div className="bg-surface-container-low px-2.5 py-1.5 rounded border border-outline-variant/40">
            <span className="text-[10px] text-outline block">Max ($)</span>
            <input
              type="number"
              placeholder="150000"
              value={filters.priceMaxUsd ?? ''}
              onChange={(e) => updateParam('priceMax', e.target.value || undefined)}
              className="w-full bg-transparent font-data-mono text-body-sm font-semibold text-primary focus:outline-none tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Box & Papers */}
      <div className="space-y-1.5 pt-1">
        <span className="text-label-md uppercase tracking-wider text-primary block">
          Kutu &amp; Sertifika
        </span>
        <label className="flex items-center gap-2 cursor-pointer text-body-sm text-on-surface">
          <input
            type="checkbox"
            checked={Boolean(filters.hasBox)}
            onChange={(e) => updateParam('box', e.target.checked ? '1' : undefined)}
            className="w-4 h-4 rounded accent-primary"
          />
          <span>Orijinal Kutu Mevcut</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-body-sm text-on-surface">
          <input
            type="checkbox"
            checked={Boolean(filters.hasPapers)}
            onChange={(e) => updateParam('papers', e.target.checked ? '1' : undefined)}
            className="w-4 h-4 rounded accent-primary"
          />
          <span>Orijinal Sertifika / Garanti Kartı</span>
        </label>
      </div>

      {/* Condition */}
      <div className="space-y-1.5 pt-1">
        <span className="text-label-md uppercase tracking-wider text-primary block">
          Kondisyon
        </span>
        <div className="space-y-1">
          {CONDITIONS.map((cond) => {
            const active = filters.conditions?.includes(cond);
            return (
              <label
                key={cond}
                className="flex items-center gap-2 cursor-pointer text-body-sm text-on-surface"
              >
                <input
                  type="checkbox"
                  checked={Boolean(active)}
                  onChange={() => toggleArrayParam('condition', cond, filters.conditions)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span>{cond}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Production Year with DualRangeSlider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-label-md uppercase tracking-wider text-primary block">
            Üretim Yılı
          </span>
          <span className="font-data-mono text-label-sm text-primary font-semibold tabular-nums">
            {currentYearMin} — {currentYearMax}
          </span>
        </div>
        <DualRangeSlider
          min={WATCH_YEAR_MIN_BOUND}
          max={WATCH_YEAR_MAX_BOUND}
          step={1}
          valueMin={currentYearMin}
          valueMax={currentYearMax}
          onChange={(nextMin, nextMax) =>
            updateMultiParams({
              yearMin: nextMin <= WATCH_YEAR_MIN_BOUND ? undefined : String(nextMin),
              yearMax: nextMax >= WATCH_YEAR_MAX_BOUND ? undefined : String(nextMax),
            })
          }
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min (2015)"
            value={filters.yearMin ?? ''}
            onChange={(e) => updateParam('yearMin', e.target.value || undefined)}
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-body-sm tabular-nums"
          />
          <input
            type="number"
            placeholder="Max (2026)"
            value={filters.yearMax ?? ''}
            onChange={(e) => updateParam('yearMax', e.target.value || undefined)}
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-body-sm tabular-nums"
          />
        </div>
      </div>

      {/* Case Diameter (Interactive Buttons) */}
      <div className="space-y-2 pt-1">
        <span className="text-label-md uppercase tracking-wider text-primary block">
          Kasa Çapı
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {CASE_SIZES.map((sz) => {
            const active = filters.caseDiameters?.includes(sz);
            return (
              <button
                key={sz}
                type="button"
                onClick={() => toggleSizeParam(sz)}
                className={cn(
                  'py-1 text-center rounded font-data-mono text-body-sm transition-colors',
                  active
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                )}
              >
                {sz} mm
              </button>
            );
          })}
        </div>
      </div>

      {/* B2B Commercial Terms Box */}
      <div className="p-3 bg-surface-container-low rounded-lg space-y-2">
        <span className="text-label-md uppercase tracking-wider text-secondary flex items-center gap-1">
          <Handshake className="w-4 h-4" />
          B2B Ticari Koşullar
        </span>
        <div className="space-y-1 text-body-sm text-on-surface">
          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-secondary" />
            <span>Pazarlık &amp; Karşı Teklife Açık</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-secondary" />
            <span>Hemen Teslim (Kasada Mevcut)</span>
          </div>
          <div className="pt-1 text-label-sm text-on-surface-variant flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-secondary" />
            <span>Konum: Kapalıçarşı / Nişantaşı</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Top Header Section */}
      <section className="w-full px-4 lg:px-8 pt-6 pb-4 bg-surface">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-label-sm text-outline mb-1">
              <Link to="/" className="hover:text-primary">
                Ana Sayfa
              </Link>
              <span>/</span>
              <span className="text-primary font-semibold">
                {isSearchMode ? 'Saat Arama' : 'Saatler Kataloğu'}
              </span>
            </div>
            <h1 className="text-headline-lg-mobile sm:text-headline-lg text-primary">
              {isSearchMode ? 'Saat Arama & Referans Sorgulama' : 'Saatler Kataloğu'}
            </h1>
            <p className="text-body-lg text-on-surface-variant mt-1">
              Doğrulanmış tedarikçilerden Rolex, Audemars Piguet, Patek Philippe ve prestijli koleksiyon parçaları.
            </p>
          </div>

          {/* 3 Metric Cards */}
          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40">
              <Watch className="w-5 h-5 text-primary-container" />
              <div className="flex flex-col">
                <span className="text-headline-sm text-primary leading-none font-bold tabular-nums">
                  {allWatches.length}
                </span>
                <span className="text-label-sm text-on-surface-variant">Aktif Saat</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40">
              <Store className="w-5 h-5 text-secondary" />
              <div className="flex flex-col">
                <span className="text-headline-sm text-primary leading-none font-bold">32</span>
                <span className="text-label-sm text-on-surface-variant">Yetkili Bayi &amp; Tüccar</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40">
              <ShieldCheck className="w-5 h-5 text-tertiary-container" />
              <div className="flex flex-col">
                <span className="text-title-md text-primary leading-none font-bold">%100</span>
                <span className="text-label-sm text-on-surface-variant">Seri No &amp; Orijinallik</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Quick Tabs Carousel */}
      <section className="w-full bg-surface-container-lowest py-3 shadow-sm border-y border-outline-variant/40">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 overflow-x-auto no-scrollbar flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateParam('brand', undefined)}
            className={cn(
              'px-4 py-2 rounded-lg text-label-md whitespace-nowrap transition-all flex items-center gap-2',
              !filters.brands || filters.brands.length === 0
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'bg-surface-container-low text-primary hover:bg-surface-container'
            )}
          >
            <span>Tüm Markalar</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-label-sm tabular-nums">
              {allWatches.length}
            </span>
          </button>

          {BRANDS.map((brand) => {
            const active = filters.brands?.includes(brand);
            const count = allWatches.filter((w) => w.brand === brand).length;
            return (
              <button
                key={brand}
                type="button"
                onClick={() => toggleArrayParam('brand', brand, filters.brands)}
                className={cn(
                  'px-4 py-2 rounded-lg text-label-md whitespace-nowrap transition-all flex items-center gap-2',
                  active
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-primary hover:bg-surface-container'
                )}
              >
                <span>{brand}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm tabular-nums">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Sidebar + Results */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Filter Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0 bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 sticky top-20">
            {FilterPanel}
          </aside>

          {/* Main Results Area */}
          <div className="flex-1 w-full space-y-4">
            {/* Results Toolbar */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-label-md text-primary"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtrele
                </button>
                <span className="text-headline-sm text-primary font-bold tabular-nums">
                  {watches.length} Saat Bulundu
                </span>

                {filters.brands?.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleArrayParam('brand', b, filters.brands)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-surface-container rounded-full text-label-sm text-primary font-semibold"
                  >
                    <span>{b}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/40">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={cn(
                      'px-2.5 py-1 rounded text-label-sm flex items-center gap-1',
                      viewMode === 'table'
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant'
                    )}
                  >
                    <TableIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Liste Görünümü</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'px-2.5 py-1 rounded text-label-sm flex items-center gap-1',
                      viewMode === 'grid'
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant'
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Vitrin</span>
                  </button>
                </div>

                <select
                  value={filters.sortBy || 'newest'}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/40 text-primary text-body-sm px-3 py-1.5 rounded-lg focus:outline-none"
                >
                  <option value="newest">Önerilen Sıralama (En Yeni)</option>
                  <option value="price-asc">Fiyat: Artan</option>
                  <option value="price-desc">Fiyat: Azalan</option>
                  <option value="year-desc">Yıl: En Yeni</option>
                </select>
              </div>
            </div>

            {/* Product Grid or Table */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-80 rounded-xl bg-surface-container-low animate-pulse" />
                ))}
              </div>
            ) : watches.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-12 text-center space-y-3">
                <p className="text-title-md text-primary">Seçilen kriterlere uygun saat bulunamadı.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {watches.map((w) => (
                  <WatchCard key={w.id} watch={w} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[780px]">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/50 text-label-sm uppercase tracking-wider text-outline">
                        <th className="py-3 px-4 sticky left-0 bg-surface-container-low z-10">
                          Marka / Model
                        </th>
                        <th className="py-3 px-3">Referans</th>
                        <th className="py-3 px-3">Yıl</th>
                        <th className="py-3 px-3">Kondisyon</th>
                        <th className="py-3 px-3">Set</th>
                        <th className="py-3 px-3">Fiyat</th>
                        <th className="py-3 px-4 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 text-body-sm tabular-nums">
                      {watches.map((w) => (
                        <tr key={w.id} className="hover:bg-surface-container-low/60 transition-colors">
                          <td className="py-3 px-4 font-semibold text-primary sticky left-0 bg-surface-container-lowest">
                            <Link to={`/saat/${w.id}`} className="hover:underline">
                              {w.brand} — {w.model}
                            </Link>
                          </td>
                          <td className="py-3 px-3 font-medium">{w.referenceNumber}</td>
                          <td className="py-3 px-3">{w.productionYear}</td>
                          <td className="py-3 px-3">{w.condition}</td>
                          <td className="py-3 px-3 text-label-sm">
                            {w.hasBox && w.hasPapers
                              ? 'Full Set'
                              : w.hasPapers
                              ? 'Sertifikalı'
                              : w.hasBox
                              ? 'Sertifikasız (Kutulu)'
                              : 'Sertifikasız'}
                          </td>
                          <td className="py-3 px-3 font-bold text-primary whitespace-nowrap">
                            {isPriceSpecified(w.priceUsd) ? (
                              formatCurrency(w.priceUsd, currency)
                            ) : (
                              <Link
                                to={`/teklif-iste?listingId=${w.id}`}
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
                                onClick={() => toggleFavorite(w.id)}
                                className={cn(
                                  'p-1.5 rounded border',
                                  isFavorite(w.id)
                                    ? 'text-error border-error bg-error-container/30'
                                    : 'text-outline border-outline-variant/50'
                                )}
                              >
                                <Heart className="w-3.5 h-3.5" />
                              </button>
                              <Link
                                to={`/saat/${w.id}`}
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
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-full max-w-sm bg-surface-container-lowest h-full overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <span className="text-title-md text-primary font-bold">Saat Filtreleri</span>
              <button type="button" onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {FilterPanel}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md"
            >
              Sonuçları Göster ({watches.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

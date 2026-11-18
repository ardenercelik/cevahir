import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PlusCircle,
  Search,
  Edit3,
  Copy,
  Trash2,
  Eye,
  RotateCcw,
  Download,
  Package,
  CheckCircle2,
  Clock,
  Verified,
  Diamond,
  Watch,
  Building2,
} from 'lucide-react';
import { listingRepository, vendorRepository } from '@/repositories';
import { resetDatabaseToSeed } from '@/infrastructure/db/atelierDb';
import type { DiamondListing, InventoryStatus, ListingCategory, WatchListing } from '@/domain/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { cn, formatCaratPrice, formatCurrency } from '@/lib/utils';
import { MediaImage } from '@/components/common/MediaImage';
import { StatusBadge } from '@/components/marketplace/StatusBadge';

const STATUS_TABS: { value: InventoryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'available', label: 'Stokta / Aktif' },
  { value: 'reserved', label: 'Rezerve' },
  { value: 'sold', label: 'Satıldı' },
  { value: 'draft', label: 'Taslak' },
  { value: 'archived', label: 'Arşiv' },
];

export function VendorInventoryPage() {
  const { activeVendorId, currency } = useMarketplace();
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState<'all' | ListingCategory>('all');
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: vendor } = useQuery({
    queryKey: ['vendor', activeVendorId],
    queryFn: () => vendorRepository.getById(activeVendorId),
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['vendor-listings', activeVendorId],
    queryFn: () => listingRepository.getByVendor(activeVendorId),
  });

  const filtered = listings.filter((item) => {
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const totalCount = listings.length;
  const availableCount = listings.filter((l) => l.status === 'available').length;
  const reservedCount = listings.filter((l) => l.status === 'reserved').length;
  const soldCount = listings.filter((l) => l.status === 'sold').length;
  const draftCount = listings.filter((l) => l.status === 'draft').length;
  const diamondCount = listings.filter((l) => l.category === 'diamond').length;
  const watchCount = listings.filter((l) => l.category === 'watch').length;
  const portfolioValueUsd = listings.reduce((sum, item) => sum + item.priceUsd, 0);

  const invalidateAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ['vendor-listings'] });
    await queryClient.invalidateQueries({ queryKey: ['diamonds'] });
    await queryClient.invalidateQueries({ queryKey: ['watches'] });
    await queryClient.invalidateQueries({ queryKey: ['listings'] });
    await queryClient.invalidateQueries({ queryKey: ['vendors'] });
    await queryClient.invalidateQueries({ queryKey: ['inquiries'] });
  };

  const handleStatusChange = async (id: string, status: InventoryStatus) => {
    await listingRepository.updateStatus(id, status);
    await invalidateAll();
  };

  const handleBulkStatus = async (status: InventoryStatus) => {
    if (selectedIds.length === 0) return;
    await Promise.all(selectedIds.map((id) => listingRepository.updateStatus(id, status)));
    setSelectedIds([]);
    await invalidateAll();
  };

  const handleDuplicate = async (id: string) => {
    await listingRepository.duplicate(id);
    await invalidateAll();
  };

  const handleDelete = async (id: string) => {
    await listingRepository.delete(id);
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    await invalidateAll();
  };

  const handleResetDemo = async () => {
    await resetDatabaseToSeed();
    setSelectedIds([]);
    await invalidateAll();
  };

  const handleExportCsv = () => {
    const header = ['SKU', 'Kategori', 'Baslik', 'Durum', 'Fiyat_USD', 'Kasa_Lokasyonu'];
    const rows = filtered.map((item) => [
      item.sku,
      item.category === 'diamond' ? 'Pirlanta' : 'Saat',
      `"${item.title.replace(/"/g, '""')}"`,
      item.status,
      String(item.priceUsd),
      `"${item.vaultLocation.replace(/"/g, '""')}"`,
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atelier-b2b-envanter-${activeVendorId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filtered.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleRowSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-5">
      {/* Vendor Context Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
            <Building2 className="w-5 h-5 text-secondary-fixed" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-label-sm text-secondary uppercase tracking-wider font-semibold">
                Tedarikçi Kasası
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" />
              <span className="font-data-mono text-label-sm text-on-surface-variant font-medium">
                B2B Prime Node
              </span>
            </div>
            <span className="text-title-md text-primary font-bold truncate">
              {vendor?.companyName || 'Tedarikçi'} ({vendor?.chamberRegistrationNo})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low text-primary hover:bg-surface-container-high transition-colors text-body-sm font-semibold shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-secondary" />
            <span>Demo Verilerini Sıfırla</span>
          </button>
          <Link
            to="/panel/ilan-ekle"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all text-body-sm font-semibold shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Yeni İlan Ekle</span>
          </Link>
        </div>
      </div>

      {/* Top Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-label-sm text-outline uppercase tracking-wider font-semibold">
                Toplam İlan
              </span>
              <div className="text-headline-lg text-primary font-bold tracking-tight mt-1 tabular-nums">
                {totalCount} Ürün
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant font-data-mono text-body-sm tabular-nums">
            <span className="font-semibold text-secondary">
              {formatCurrency(portfolioValueUsd, currency)}
            </span>
            <span className="text-outline">·</span>
            <span className="text-label-sm">Portföy Rayiç</span>
          </div>
          <div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full w-full" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-label-sm text-outline uppercase tracking-wider font-semibold">
                Stokta (Mevcut)
              </span>
              <div className="text-headline-lg text-primary font-bold tracking-tight mt-1 tabular-nums">
                {availableCount} Ürün
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary-container">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant text-label-sm truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
            <span>Kapalıçarşı &amp; Kuyumcukent kasalarında</span>
          </div>
          <div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-tertiary-container h-full rounded-full"
              style={{ width: `${totalCount ? (availableCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-label-sm text-outline uppercase tracking-wider font-semibold">
                Rezerve
              </span>
              <div className="text-headline-lg text-primary font-bold tracking-tight mt-1 tabular-nums">
                {reservedCount} Ürün
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant text-label-sm truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>B2B alıcı teklif incelemesinde</span>
          </div>
          <div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full"
              style={{ width: `${totalCount ? (reservedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-label-sm text-outline uppercase tracking-wider font-semibold">
                Satıldı &amp; Taslak
              </span>
              <div className="text-headline-lg text-primary font-bold tracking-tight mt-1 tabular-nums">
                {soldCount} Satıldı · {draftCount} Taslak
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-outline">
              <Verified className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant text-label-sm truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            <span>Tamamlanan takaslar ve taslaklar</span>
          </div>
          <div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-outline h-full rounded-full"
              style={{ width: `${totalCount ? ((soldCount + draftCount) / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search, Category Switcher, Status Pills & Bulk Actions Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/40 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Stok ID, Ürün Adı, Saat Ref (örn. 126710), Pırlanta Sertifika No ara..."
              className="w-full bg-surface-container-low rounded-lg pl-10 pr-12 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-data-mono text-label-sm text-outline bg-surface-container-high px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={cn(
                'px-3.5 py-1.5 rounded text-body-sm font-semibold transition-all whitespace-nowrap',
                categoryFilter === 'all'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              Tüm Ürünler <span className="text-outline font-normal ml-1">({totalCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('diamond')}
              className={cn(
                'px-3.5 py-1.5 rounded text-body-sm font-semibold transition-all whitespace-nowrap',
                categoryFilter === 'diamond'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              Pırlantalar <span className="text-outline font-normal ml-1">({diamondCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('watch')}
              className={cn(
                'px-3.5 py-1.5 rounded text-body-sm font-semibold transition-all whitespace-nowrap',
                categoryFilter === 'watch'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              Saatler <span className="text-outline font-normal ml-1">({watchCount})</span>
            </button>
          </div>
        </div>

        {/* Status Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-label-sm text-outline font-semibold uppercase mr-1">Durum:</span>
            {STATUS_TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setStatusFilter(t.value)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-label-md font-semibold transition-all',
                  statusFilter === t.value
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low px-4 py-2.5 rounded-lg">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filtered.length > 0 && selectedIds.length === filtered.length}
                onChange={(e) => toggleSelectAll(e.target.checked)}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
              <span className="text-label-md font-semibold text-primary">Tümünü Seç</span>
            </label>
            <span className="text-outline text-label-sm">|</span>
            <span className="text-label-sm font-medium text-on-surface-variant tabular-nums">
              {selectedIds.length} öğe seçili
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleBulkStatus('available')}
              disabled={selectedIds.length === 0}
              className="px-3 py-1.5 rounded bg-surface-container-lowest text-primary hover:bg-surface-container-high text-label-md font-semibold shadow-sm disabled:opacity-50"
            >
              Stokta Yap
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus('reserved')}
              disabled={selectedIds.length === 0}
              className="px-3 py-1.5 rounded bg-surface-container-lowest text-primary hover:bg-surface-container-high text-label-md font-semibold shadow-sm disabled:opacity-50"
            >
              Rezerve Et
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus('sold')}
              disabled={selectedIds.length === 0}
              className="px-3 py-1.5 rounded bg-surface-container-lowest text-primary hover:bg-surface-container-high text-label-md font-semibold shadow-sm disabled:opacity-50"
            >
              Satıldı Yap
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-surface-container-lowest text-primary hover:bg-surface-container-high text-label-md font-semibold shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Dışa Aktar CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table / Mobile Cards */}
      {isLoading ? (
        <div className="h-64 rounded-xl bg-surface-container-low animate-pulse" />
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-10 text-center space-y-3">
          <p className="text-title-md text-primary">Bu filtrede envanter kaydı bulunmuyor.</p>
          <Link
            to="/panel/ilan-ekle"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary text-label-md"
          >
            Yeni İlan Oluştur
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[980px]">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-label-sm uppercase tracking-wider border-b border-outline-variant/40">
                    <th className="py-3 px-3 w-10 text-center">Seç</th>
                    <th className="py-3 px-3 w-16">Görsel</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-4">Ürün Adı &amp; Model</th>
                    <th className="py-3 px-3">Stok ID / Ref</th>
                    <th className="py-3 px-3">Önemli Özellikler</th>
                    <th className="py-3 px-3 text-right">Fiyat</th>
                    <th className="py-3 px-3 text-center">Stok Durumu</th>
                    <th className="py-3 px-3">Lokasyon</th>
                    <th className="py-3 px-4 text-center">Aksiyonlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-body-sm">
                  {filtered.map((item) => {
                    const isDia = item.category === 'diamond';
                    const d = isDia ? (item as DiamondListing) : null;
                    const w = !isDia ? (item as WatchListing) : null;
                    return (
                      <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleRowSelect(item.id)}
                            className="w-4 h-4 rounded accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="relative w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden shadow-sm">
                            <MediaImage media={item.media[0]} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm font-semibold bg-surface-container-high',
                              isDia ? 'text-secondary' : 'text-primary'
                            )}
                          >
                            {isDia ? <Diamond className="w-3 h-3" /> : <Watch className="w-3 h-3" />}
                            <span>{isDia ? 'Pırlanta' : 'Saat'}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-primary">
                          <Link
                            to={isDia ? `/pirlanta/${item.id}` : `/saat/${item.id}`}
                            className="hover:underline block"
                          >
                            {item.title}
                          </Link>
                          <span className="text-label-sm text-outline font-normal">
                            {d
                              ? `${d.origin === 'natural' ? 'Doğal Elmas' : 'Lab-Grown'} · ${d.certLab}`
                              : `${w?.brand} · ${w?.braceletMaterial}`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-data-mono text-label-md whitespace-nowrap">
                          <div className="font-bold text-primary">{item.sku}</div>
                          <div className="text-outline text-label-sm">
                            {d ? d.certNumber : `Ref. ${w?.referenceNumber}`}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-data-mono text-label-sm whitespace-nowrap">
                          {d ? (
                            <div className="flex items-center gap-1.5">
                              <span className="bg-surface-container px-1.5 py-0.5 rounded font-bold text-primary">
                                {d.carat.toFixed(2)}ct
                              </span>
                              <span>·</span>
                              <span className="bg-surface-container px-1.5 py-0.5 rounded">
                                {d.color} / {d.clarity}
                              </span>
                              <span>·</span>
                              <span className="text-tertiary-container font-bold">{d.cut}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="bg-surface-container px-1.5 py-0.5 rounded">
                                {w?.caseDiameterMm}mm
                              </span>
                              <span>·</span>
                              <span className="text-secondary font-bold">{w?.productionYear}</span>
                              <span>·</span>
                              <span className="text-tertiary-container font-semibold">
                                {w?.hasBox && w?.hasPapers
                                  ? 'Full Set'
                                  : w?.hasPapers
                                  ? 'Sertifikalı'
                                  : 'Sertifikasız'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap tabular-nums">
                          <div className="font-bold text-primary">
                            {formatCurrency(item.priceUsd, currency)}
                          </div>
                          <div className="text-label-sm text-outline font-data-mono">
                            {d
                              ? formatCaratPrice(d.pricePerCaratUsd, currency, d.priceUsd)
                              : '1 Adet'}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(item.id, e.target.value as InventoryStatus)
                            }
                            className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-2 py-1 text-label-sm font-semibold text-primary"
                          >
                            <option value="draft">Taslak</option>
                            <option value="available">Mevcut</option>
                            <option value="reserved">Rezerve</option>
                            <option value="sold">Satıldı</option>
                            <option value="archived">Arşiv</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="text-label-sm text-secondary font-semibold">
                            {item.vaultLocation}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <Link
                              to={`/panel/onizleme/${item.id}`}
                              title="Önizle"
                              className="p-1.5 rounded hover:bg-surface-container text-outline hover:text-primary"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/panel/ilan-duzenle/${item.id}`}
                              title="Düzenle"
                              className="p-1.5 rounded hover:bg-surface-container text-outline hover:text-primary"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(item.id)}
                              title="Çoğalt"
                              className="p-1.5 rounded hover:bg-surface-container text-outline hover:text-primary"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              title="Sil"
                              className="p-1.5 rounded hover:bg-error-container text-outline hover:text-error"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container shrink-0">
                    <MediaImage media={item.media[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-label-sm text-outline tabular-nums">{item.sku}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <h3 className="text-body-md font-bold text-primary truncate">{item.title}</h3>
                    <div className="text-title-md font-bold text-primary tabular-nums mt-0.5">
                      {formatCurrency(item.priceUsd, currency)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/40">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as InventoryStatus)}
                    className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-2.5 py-1.5 text-label-sm font-semibold text-primary"
                  >
                    <option value="draft">Taslak</option>
                    <option value="available">Mevcut</option>
                    <option value="reserved">Rezerve</option>
                    <option value="sold">Satıldı</option>
                    <option value="archived">Arşiv</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/panel/onizleme/${item.id}`}
                      className="p-2 rounded-lg bg-surface-container-low text-primary"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/panel/ilan-duzenle/${item.id}`}
                      className="p-2 rounded-lg bg-surface-container-low text-primary"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(item.id)}
                      className="p-2 rounded-lg bg-surface-container-low text-primary"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg bg-error-container/40 text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

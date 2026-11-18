import { db, ensureSeeded } from '@/infrastructure/db/atelierDb';
import type {
  DiamondFilterParams,
  DiamondListing,
  InventoryStatus,
  MarketplaceListing,
  WatchFilterParams,
  WatchListing,
} from '@/domain/types';
import type { ListingRepository } from '@/repositories/interfaces';

function comparePricesAsc(aPrice: number, bPrice: number): number {
  const aUnpriced = !aPrice || aPrice <= 0;
  const bUnpriced = !bPrice || bPrice <= 0;
  if (aUnpriced && bUnpriced) return 0;
  if (aUnpriced) return 1;
  if (bUnpriced) return -1;
  return aPrice - bPrice;
}

function comparePricesDesc(aPrice: number, bPrice: number): number {
  const aUnpriced = !aPrice || aPrice <= 0;
  const bUnpriced = !bPrice || bPrice <= 0;
  if (aUnpriced && bUnpriced) return 0;
  if (aUnpriced) return 1;
  if (bUnpriced) return -1;
  return bPrice - aPrice;
}

export class LocalListingRepository implements ListingRepository {
  async getAll(includeNonAvailable = false): Promise<MarketplaceListing[]> {
    await ensureSeeded();
    const all = await db.listings.toArray();
    const filtered = includeNonAvailable ? all : all.filter((l) => l.status === 'available');
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getById(id: string): Promise<MarketplaceListing | undefined> {
    await ensureSeeded();
    return db.listings.get(id);
  }

  async getByVendor(vendorId: string): Promise<MarketplaceListing[]> {
    await ensureSeeded();
    const items = await db.listings.where('vendorId').equals(vendorId).toArray();
    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getDiamonds(filters: DiamondFilterParams = {}): Promise<DiamondListing[]> {
    await ensureSeeded();
    const all = (await db.listings.where('category').equals('diamond').toArray()) as DiamondListing[];
    let result = all.filter((item) => item.status === 'available');

    if (filters.vendorId) {
      result = result.filter((d) => d.vendorId === filters.vendorId);
    }
    if (filters.origin && filters.origin !== 'all') {
      result = result.filter((d) => d.origin === filters.origin);
    }
    if (filters.shapes && filters.shapes.length > 0) {
      result = result.filter((d) => filters.shapes!.includes(d.shape));
    }
    if (filters.caratMin !== undefined) {
      result = result.filter((d) => d.carat >= filters.caratMin!);
    }
    if (filters.caratMax !== undefined) {
      result = result.filter((d) => d.carat <= filters.caratMax!);
    }
    if (filters.colors && filters.colors.length > 0) {
      result = result.filter((d) => filters.colors!.includes(d.color));
    }
    if (filters.clarities && filters.clarities.length > 0) {
      result = result.filter((d) => filters.clarities!.includes(d.clarity));
    }
    if (filters.cuts && filters.cuts.length > 0) {
      result = result.filter((d) => filters.cuts!.includes(d.cut));
    }
    if (filters.polishes && filters.polishes.length > 0) {
      result = result.filter((d) => filters.polishes!.includes(d.polish));
    }
    if (filters.symmetries && filters.symmetries.length > 0) {
      result = result.filter((d) => filters.symmetries!.includes(d.symmetry));
    }
    if (filters.fluorescences && filters.fluorescences.length > 0) {
      result = result.filter((d) => filters.fluorescences!.includes(d.fluorescence));
    }
    if (filters.certLabs && filters.certLabs.length > 0) {
      result = result.filter((d) => filters.certLabs!.includes(d.certLab));
    }
    if (filters.vaultLocation && filters.vaultLocation.trim()) {
      const loc = filters.vaultLocation.toLowerCase();
      result = result.filter((d) => d.vaultLocation.toLowerCase().includes(loc));
    }
    if (filters.priceMinUsd !== undefined) {
      result = result.filter((d) => d.priceUsd > 0 && d.priceUsd >= filters.priceMinUsd!);
    }
    if (filters.priceMaxUsd !== undefined) {
      result = result.filter(
        (d) =>
          (filters.priceMinUsd === undefined && (!d.priceUsd || d.priceUsd <= 0)) ||
          (d.priceUsd > 0 && d.priceUsd <= filters.priceMaxUsd!)
      );
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.sku.toLowerCase().includes(q) ||
          d.certNumber.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.shape.toLowerCase().includes(q)
      );
    }

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => comparePricesAsc(a.priceUsd, b.priceUsd));
        break;
      case 'price-desc':
        result.sort((a, b) => comparePricesDesc(a.priceUsd, b.priceUsd));
        break;
      case 'carat-desc':
        result.sort((a, b) => b.carat - a.carat);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
    }

    return result;
  }

  async getWatches(filters: WatchFilterParams = {}): Promise<WatchListing[]> {
    await ensureSeeded();
    const all = (await db.listings.where('category').equals('watch').toArray()) as WatchListing[];
    let result = all.filter((item) => item.status === 'available');

    if (filters.vendorId) {
      result = result.filter((w) => w.vendorId === filters.vendorId);
    }
    if (filters.brands && filters.brands.length > 0) {
      result = result.filter((w) => filters.brands!.includes(w.brand));
    }
    if (filters.conditions && filters.conditions.length > 0) {
      result = result.filter((w) => filters.conditions!.includes(w.condition));
    }
    if (filters.yearMin !== undefined) {
      result = result.filter((w) => w.productionYear >= filters.yearMin!);
    }
    if (filters.yearMax !== undefined) {
      result = result.filter((w) => w.productionYear <= filters.yearMax!);
    }
    if (filters.caseDiameters && filters.caseDiameters.length > 0) {
      result = result.filter((w) => filters.caseDiameters!.includes(w.caseDiameterMm));
    }
    if (filters.priceMinUsd !== undefined) {
      result = result.filter((w) => w.priceUsd > 0 && w.priceUsd >= filters.priceMinUsd!);
    }
    if (filters.priceMaxUsd !== undefined) {
      result = result.filter(
        (w) =>
          (filters.priceMinUsd === undefined && (!w.priceUsd || w.priceUsd <= 0)) ||
          (w.priceUsd > 0 && w.priceUsd <= filters.priceMaxUsd!)
      );
    }
    if (filters.hasBox) {
      result = result.filter((w) => w.hasBox);
    }
    if (filters.hasPapers) {
      result = result.filter((w) => w.hasPapers);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.brand.toLowerCase().includes(q) ||
          w.model.toLowerCase().includes(q) ||
          w.referenceNumber.toLowerCase().includes(q) ||
          w.sku.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q)
      );
    }

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => comparePricesAsc(a.priceUsd, b.priceUsd));
        break;
      case 'price-desc':
        result.sort((a, b) => comparePricesDesc(a.priceUsd, b.priceUsd));
        break;
      case 'year-desc':
        result.sort((a, b) => b.productionYear - a.productionYear);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
    }

    return result;
  }

  async create(listing: MarketplaceListing): Promise<MarketplaceListing> {
    await ensureSeeded();
    await db.listings.put(listing);
    return listing;
  }

  async update(id: string, patch: Partial<MarketplaceListing>): Promise<MarketplaceListing> {
    await ensureSeeded();
    const existing = await db.listings.get(id);
    if (!existing) throw new Error(`İlan bulunamadı: ${id}`);
    const updated = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    } as MarketplaceListing;
    await db.listings.put(updated);
    return updated;
  }

  async updateStatus(id: string, status: InventoryStatus): Promise<MarketplaceListing> {
    return this.update(id, { status });
  }

  async duplicate(id: string): Promise<MarketplaceListing> {
    await ensureSeeded();
    const existing = await db.listings.get(id);
    if (!existing) throw new Error(`Kopyalanacak ilan bulunamadı: ${id}`);
    const now = new Date().toISOString();
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const copy: MarketplaceListing = {
      ...existing,
      id: `${existing.category === 'diamond' ? 'dia' : 'wat'}-${Date.now()}`,
      sku: `${existing.sku}-K${suffix}`,
      title: `${existing.title} (Kopya)`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    await db.listings.put(copy);
    return copy;
  }

  async delete(id: string): Promise<void> {
    await ensureSeeded();
    await db.listings.delete(id);
  }
}

import Dexie, { type Table } from 'dexie';
import type { Inquiry, MarketplaceListing, Vendor } from '@/domain/types';
import seedVendors from '@/data/seedVendors.json';
import seedDiamonds from '@/data/seedDiamonds.json';
import seedWatches from '@/data/seedWatches.json';
import seedInquiries from '@/data/seedInquiries.json';

export interface StoredMediaRecord {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  blob: Blob;
  createdAt: string;
}

class AtelierDatabase extends Dexie {
  vendors!: Table<Vendor, string>;
  listings!: Table<MarketplaceListing, string>;
  inquiries!: Table<Inquiry, string>;
  media!: Table<StoredMediaRecord, string>;

  constructor() {
    super('atelier_b2b_cevahir_db_v4');
    this.version(1).stores({
      vendors: 'id, companyName, city, specialty',
      listings: 'id, sku, category, vendorId, status, createdAt',
      inquiries: 'id, listingId, vendorId, status, createdAt',
      media: 'id, createdAt',
    });
  }
}

export const db = new AtelierDatabase();

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const [vendorCount, listingCount, inquiryCount] = await Promise.all([
        db.vendors.count(),
        db.listings.count(),
        db.inquiries.count(),
      ]);

      if (vendorCount === 0) {
        await db.vendors.bulkPut(seedVendors as Vendor[]);
      }
      if (listingCount === 0) {
        const allListings = [
          ...(seedDiamonds as MarketplaceListing[]),
          ...(seedWatches as MarketplaceListing[]),
        ];
        await db.listings.bulkPut(allListings);
      }
      if (inquiryCount === 0) {
        await db.inquiries.bulkPut(seedInquiries as Inquiry[]);
      }
    })();
  }
  return seedPromise;
}

export async function resetDatabaseToSeed(): Promise<void> {
  await Promise.all([
    db.vendors.clear(),
    db.listings.clear(),
    db.inquiries.clear(),
    db.media.clear(),
  ]);
  seedPromise = null;
  await ensureSeeded();
}

import type {
  DiamondFilterParams,
  DiamondListing,
  Inquiry,
  InquiryStatus,
  InventoryStatus,
  MarketplaceListing,
  Vendor,
  WatchFilterParams,
  WatchListing,
} from '@/domain/types';

export interface ListingRepository {
  getAll(includeNonAvailable?: boolean): Promise<MarketplaceListing[]>;
  getById(id: string): Promise<MarketplaceListing | undefined>;
  getByVendor(vendorId: string): Promise<MarketplaceListing[]>;
  getDiamonds(filters?: DiamondFilterParams): Promise<DiamondListing[]>;
  getWatches(filters?: WatchFilterParams): Promise<WatchListing[]>;
  create(listing: MarketplaceListing): Promise<MarketplaceListing>;
  update(id: string, patch: Partial<MarketplaceListing>): Promise<MarketplaceListing>;
  updateStatus(id: string, status: InventoryStatus): Promise<MarketplaceListing>;
  duplicate(id: string): Promise<MarketplaceListing>;
  delete(id: string): Promise<void>;
}

export interface VendorRepository {
  getAll(): Promise<Vendor[]>;
  getById(id: string): Promise<Vendor | undefined>;
  create(vendor: Vendor): Promise<Vendor>;
  update(id: string, patch: Partial<Vendor>): Promise<Vendor>;
}

export interface InquiryRepository {
  getAll(): Promise<Inquiry[]>;
  getByVendor(vendorId: string): Promise<Inquiry[]>;
  create(inquiry: Inquiry): Promise<Inquiry>;
  updateStatus(id: string, status: InquiryStatus): Promise<Inquiry>;
}

export interface MediaRepository {
  saveFile(file: File): Promise<{ id: string; fileName: string; mimeType: string }>;
  getObjectUrl(mediaId: string): Promise<string | null>;
  delete(mediaId: string): Promise<void>;
}

export type ListingCategory = 'diamond' | 'watch';

export type InventoryStatus = 'draft' | 'available' | 'reserved' | 'sold' | 'archived';

export type DiamondOrigin = 'natural' | 'lab';

export type DiamondShape =
  | 'Round'
  | 'Oval'
  | 'Cushion'
  | 'Emerald'
  | 'Radiant'
  | 'Pear'
  | 'Princess'
  | 'Marquise'
  | 'Asscher'
  | 'Heart';

export type DiamondColor = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';
export type DiamondClarity = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2';
export type DiamondCut = 'Ideal' | 'Excellent' | 'Very Good' | 'Good';
export type DiamondCertLab = 'GIA' | 'IGI' | 'HRD' | 'Sertifikasız';
export type DiamondFluorescence = 'None' | 'Faint' | 'Medium' | 'Strong';

export type WatchCondition = 'Sıfır / Etiketli' | 'Çok İyi (Kılcal Çiziksiz)' | 'İyi (Kullanılmış)' | 'Koleksiyonluk';

export interface MediaRef {
  id: string;
  url?: string;
  mediaId?: string;
  alt?: string;
}

export interface DiamondListing {
  id: string;
  sku: string;
  category: 'diamond';
  vendorId: string;
  status: InventoryStatus;
  title: string;
  origin: DiamondOrigin;
  shape: DiamondShape;
  carat: number;
  color: DiamondColor;
  clarity: DiamondClarity;
  cut: DiamondCut;
  polish: DiamondCut;
  symmetry: DiamondCut;
  fluorescence: DiamondFluorescence;
  certLab: DiamondCertLab;
  certNumber: string;
  measurements: string;
  depthPercent: number;
  tablePercent: number;
  ratio: number;
  priceUsd: number;
  pricePerCaratUsd: number;
  vaultLocation: string;
  description: string;
  media: MediaRef[];
  createdAt: string;
  updatedAt: string;
}

export interface WatchListing {
  id: string;
  sku: string;
  category: 'watch';
  vendorId: string;
  status: InventoryStatus;
  title: string;
  brand: string;
  model: string;
  referenceNumber: string;
  productionYear: number;
  condition: WatchCondition;
  hasBox: boolean;
  hasPapers: boolean;
  caseMaterial: string;
  caseDiameterMm: number;
  dialColor: string;
  movement: string;
  caliber: string;
  powerReserveHours: number;
  braceletMaterial: string;
  waterResistanceM: number;
  priceUsd: number;
  vaultLocation: string;
  description: string;
  media: MediaRef[];
  createdAt: string;
  updatedAt: string;
}

export type MarketplaceListing = DiamondListing | WatchListing;

export interface Vendor {
  id: string;
  companyName: string;
  city: string;
  district: string;
  chamberRegistrationNo: string;
  specialty: 'Pırlanta' | 'Saat' | 'Pırlanta & Saat';
  verified: boolean;
  rating: number;
  completedTrades: number;
  phone: string;
  email: string;
  about: string;
  foundedYear: number;
  createdAt: string;
}

export type InquiryStatus = 'new' | 'reviewing' | 'replied' | 'closed';

export interface Inquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  listingSku: string;
  listingCategory: ListingCategory;
  vendorId: string;
  buyerCompany: string;
  buyerContactName: string;
  buyerEmail: string;
  buyerPhone: string;
  offerPriceUsd?: number;
  deliveryPreference: 'Kapalıçarşı Emanet Kasa' | 'Sigortalı Zırhlı Kurye' | 'Atölye İçi Ekspertiz';
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface DiamondFilterParams {
  search?: string;
  origin?: DiamondOrigin | 'all';
  shapes?: DiamondShape[];
  caratMin?: number;
  caratMax?: number;
  colors?: DiamondColor[];
  clarities?: DiamondClarity[];
  cuts?: DiamondCut[];
  polishes?: DiamondCut[];
  symmetries?: DiamondCut[];
  fluorescences?: DiamondFluorescence[];
  certLabs?: DiamondCertLab[];
  vaultLocation?: string;
  priceMinUsd?: number;
  priceMaxUsd?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'carat-desc';
  vendorId?: string;
}

export interface WatchFilterParams {
  search?: string;
  brands?: string[];
  conditions?: WatchCondition[];
  yearMin?: number;
  yearMax?: number;
  caseDiameters?: number[];
  priceMinUsd?: number;
  priceMaxUsd?: number;
  hasBox?: boolean;
  hasPapers?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'year-desc';
  vendorId?: string;
}

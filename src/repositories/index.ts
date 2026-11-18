import { LocalListingRepository } from '@/repositories/local/LocalListingRepository';
import { LocalVendorRepository } from '@/repositories/local/LocalVendorRepository';
import { LocalInquiryRepository } from '@/repositories/local/LocalInquiryRepository';
import { LocalMediaRepository } from '@/repositories/local/LocalMediaRepository';

export const listingRepository = new LocalListingRepository();
export const vendorRepository = new LocalVendorRepository();
export const inquiryRepository = new LocalInquiryRepository();
export const mediaRepository = new LocalMediaRepository();

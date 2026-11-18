import { db, ensureSeeded } from '@/infrastructure/db/atelierDb';
import type { Inquiry, InquiryStatus } from '@/domain/types';
import type { InquiryRepository } from '@/repositories/interfaces';

export class LocalInquiryRepository implements InquiryRepository {
  async getAll(): Promise<Inquiry[]> {
    await ensureSeeded();
    const items = await db.inquiries.toArray();
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getByVendor(vendorId: string): Promise<Inquiry[]> {
    await ensureSeeded();
    const items = await db.inquiries.where('vendorId').equals(vendorId).toArray();
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async create(inquiry: Inquiry): Promise<Inquiry> {
    await ensureSeeded();
    await db.inquiries.put(inquiry);
    return inquiry;
  }

  async updateStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    await ensureSeeded();
    const existing = await db.inquiries.get(id);
    if (!existing) throw new Error(`Talep bulunamadı: ${id}`);
    const updated: Inquiry = { ...existing, status };
    await db.inquiries.put(updated);
    return updated;
  }
}

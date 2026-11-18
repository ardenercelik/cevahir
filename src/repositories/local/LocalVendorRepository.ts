import { db, ensureSeeded } from '@/infrastructure/db/atelierDb';
import type { Vendor } from '@/domain/types';
import type { VendorRepository } from '@/repositories/interfaces';

export class LocalVendorRepository implements VendorRepository {
  async getAll(): Promise<Vendor[]> {
    await ensureSeeded();
    return db.vendors.toArray();
  }

  async getById(id: string): Promise<Vendor | undefined> {
    await ensureSeeded();
    return db.vendors.get(id);
  }

  async create(vendor: Vendor): Promise<Vendor> {
    await ensureSeeded();
    await db.vendors.put(vendor);
    return vendor;
  }

  async update(id: string, patch: Partial<Vendor>): Promise<Vendor> {
    await ensureSeeded();
    const existing = await db.vendors.get(id);
    if (!existing) throw new Error(`Tedarikçi bulunamadı: ${id}`);
    const updated: Vendor = { ...existing, ...patch };
    await db.vendors.put(updated);
    return updated;
  }
}

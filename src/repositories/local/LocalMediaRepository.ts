import { db } from '@/infrastructure/db/atelierDb';
import type { MediaRepository } from '@/repositories/interfaces';

const objectUrlCache = new Map<string, string>();

export class LocalMediaRepository implements MediaRepository {
  async saveFile(file: File): Promise<{ id: string; fileName: string; mimeType: string }> {
    const id = `med-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await db.media.put({
      id,
      fileName: file.name,
      mimeType: file.type || 'image/jpeg',
      sizeBytes: file.size,
      blob: file,
      createdAt: new Date().toISOString(),
    });
    return { id, fileName: file.name, mimeType: file.type };
  }

  async getObjectUrl(mediaId: string): Promise<string | null> {
    const cached = objectUrlCache.get(mediaId);
    if (cached) return cached;
    const record = await db.media.get(mediaId);
    if (!record) return null;
    const url = URL.createObjectURL(record.blob);
    objectUrlCache.set(mediaId, url);
    return url;
  }

  async delete(mediaId: string): Promise<void> {
    const cached = objectUrlCache.get(mediaId);
    if (cached) {
      URL.revokeObjectURL(cached);
      objectUrlCache.delete(mediaId);
    }
    await db.media.delete(mediaId);
  }
}

import { useRef, useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import type { MediaRef } from '@/domain/types';
import { mediaRepository } from '@/repositories';
import { MediaImage } from '@/components/common/MediaImage';

interface LocalMediaUploaderProps {
  media: MediaRef[];
  onChange: (next: MediaRef[]) => void;
}

export function LocalMediaUploader({ media, onChange }: LocalMediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const added: MediaRef[] = [];
      for (const file of Array.from(files)) {
        const saved = await mediaRepository.saveFile(file);
        added.push({
          id: saved.id,
          mediaId: saved.id,
          alt: saved.fileName,
        });
      }
      onChange([...media, ...added]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onChange(media.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-6 text-center cursor-pointer bg-surface-container-low/50 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-7 h-7 text-secondary mx-auto mb-2" />
        <p className="text-body-sm font-semibold text-primary">
          {uploading ? 'Görseller IndexedDB’ye kaydediliyor...' : 'Bilgisayarınızdan veya telefonunuzdan fotoğraf seçin'}
        </p>
        <p className="text-label-sm text-outline mt-1">
          Yüklenen görseller harici sunucuya gönderilmez, yerel tarayıcı veritabanında (IndexedDB) saklanır.
        </p>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {media.map((m) => (
            <div
              key={m.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant/50 bg-surface-container group"
            >
              <MediaImage media={m} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(m.id)}
                aria-label="Görseli kaldır"
                className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-error text-white shadow-sm opacity-90 hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

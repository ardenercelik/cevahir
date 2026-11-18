import { useEffect, useState } from 'react';
import type { MediaRef } from '@/domain/types';
import { mediaRepository } from '@/repositories';
import { resolveAssetUrl } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface MediaImageProps {
  media?: MediaRef;
  alt?: string;
  className?: string;
}

export function MediaImage({ media, alt, className = 'w-full h-full object-cover' }: MediaImageProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(() =>
    media?.url ? resolveAssetUrl(media.url) : null
  );

  useEffect(() => {
    let active = true;
    if (!media) {
      setResolvedUrl(null);
      return;
    }
    if (media.url) {
      setResolvedUrl(resolveAssetUrl(media.url));
      return;
    }
    if (media.mediaId) {
      mediaRepository.getObjectUrl(media.mediaId).then((url) => {
        if (active) setResolvedUrl(url);
      });
    }
    return () => {
      active = false;
    };
  }, [media]);

  if (!resolvedUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container text-outline gap-1 p-3">
        <ImageOff className="w-6 h-6 opacity-60" />
        <span className="text-label-sm uppercase tracking-wider">Görsel Yok</span>
      </div>
    );
  }

  return <img src={resolvedUrl} alt={alt || media?.alt || 'Atelier B2B Ürün'} className={className} />;
}

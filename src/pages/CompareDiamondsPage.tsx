import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Scale, X, Trash2, Send } from 'lucide-react';
import { listingRepository } from '@/repositories';
import type { DiamondListing } from '@/domain/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency } from '@/lib/utils';
import { MediaImage } from '@/components/common/MediaImage';

export function CompareDiamondsPage() {
  const { compareIds, removeCompare, clearCompare, currency } = useMarketplace();

  const { data: allDiamonds = [] } = useQuery({
    queryKey: ['diamonds', 'compare-pool'],
    queryFn: () => listingRepository.getDiamonds(),
  });

  const items: DiamondListing[] = compareIds
    .map((id) => allDiamonds.find((d) => d.id === id))
    .filter((d): d is DiamondListing => Boolean(d));

  const rows: { label: string; render: (d: DiamondListing) => string }[] = [
    { label: 'Taş No (SKU)', render: (d) => d.sku },
    { label: 'Menşei', render: (d) => (d.origin === 'natural' ? 'Doğal' : 'Laboratuvar') },
    { label: 'Kesim Formu', render: (d) => d.shape },
    { label: 'Karat', render: (d) => `${d.carat.toFixed(2)} ct` },
    { label: 'Renk', render: (d) => d.color },
    { label: 'Berraklık', render: (d) => d.clarity },
    { label: 'Kesim Kalitesi', render: (d) => d.cut },
    { label: 'Cila / Simetri', render: (d) => `${d.polish} / ${d.symmetry}` },
    { label: 'Floresan', render: (d) => d.fluorescence },
    {
      label: 'Sertifika',
      render: (d) =>
        d.certLab === 'Sertifikasız' ? 'Sertifikasız' : `${d.certLab} (${d.certNumber})`,
    },
    { label: 'Ölçüler', render: (d) => d.measurements },
    { label: 'Derinlik / Tabla', render: (d) => `%${d.depthPercent} / %${d.tablePercent}` },
    { label: 'Ct Başı Fiyat', render: (d) => `${formatCurrency(d.pricePerCaratUsd, currency)} / ct` },
    { label: 'Fiyat', render: (d) => formatCurrency(d.priceUsd, currency) },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg-mobile sm:text-headline-lg text-primary flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-secondary" />
            <span>Pırlanta Karşılaştırma</span>
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            En fazla 4 adet pırlantanın 4C, oran ve fiyat verilerini yan yana kıyaslayın.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCompare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-outline-variant text-label-md text-error hover:bg-error-container/30"
          >
            <Trash2 className="w-4 h-4" />
            Listeyi Temizle
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-12 text-center space-y-4">
          <Scale className="w-10 h-10 text-outline mx-auto" />
          <h2 className="text-title-md text-primary">Karşılaştırma listeniz boş.</h2>
          <p className="text-body-sm text-on-surface-variant">
            Pırlanta kataloğundan veya detay sayfasından terazi simgesine tıklayarak taş ekleyebilirsiniz.
          </p>
          <Link
            to="/pirlantalar"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md"
          >
            Pırlanta Kataloğuna Git
          </Link>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low">
                  <th className="p-4 w-48 text-label-sm uppercase tracking-wider text-outline sticky left-0 bg-surface-container-low z-10">
                    Teknik Parametre
                  </th>
                  {items.map((d) => (
                    <th key={d.id} className="p-4 min-w-[210px] align-top">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link to={`/pirlanta/${d.id}`} className="text-title-md text-primary hover:underline">
                          {d.carat.toFixed(2)} ct {d.shape}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeCompare(d.id)}
                          className="p-1 rounded hover:bg-surface-container text-outline hover:text-error"
                          aria-label="Kaldır"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container mb-2">
                        <MediaImage media={d.media[0]} className="w-full h-full object-cover" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-body-sm tabular-nums">
                {rows.map((row) => (
                  <tr key={row.label} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-4 font-semibold text-on-surface-variant sticky left-0 bg-surface-container-lowest">
                      {row.label}
                    </td>
                    {items.map((d) => (
                      <td key={d.id} className="py-3 px-4 font-medium text-primary">
                        {row.render(d)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="py-4 px-4 font-semibold text-on-surface-variant sticky left-0 bg-surface-container-lowest">
                    İşlem
                  </td>
                  {items.map((d) => (
                    <td key={d.id} className="py-4 px-4">
                      <Link
                        to={`/teklif-iste?listingId=${d.id}`}
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-primary-container text-on-primary text-label-md hover:bg-primary"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Teklif İste
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

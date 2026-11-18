import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Phone, Mail } from 'lucide-react';
import { inquiryRepository } from '@/repositories';
import type { InquiryStatus } from '@/domain/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency } from '@/lib/utils';

export function VendorInquiriesPage() {
  const { activeVendorId, currency } = useMarketplace();
  const queryClient = useQueryClient();

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['inquiries', activeVendorId],
    queryFn: () => inquiryRepository.getByVendor(activeVendorId),
  });

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    await inquiryRepository.updateStatus(id, status);
    await queryClient.invalidateQueries({ queryKey: ['inquiries'] });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md sm:text-headline-lg text-primary">
          Gelen Teklif &amp; İnceleme Talepleri
        </h1>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Alıcı kuyumcu ve atölyelerden gelen teklifleri takip edin ve durumlarını güncelleyin.
        </p>
      </div>

      {isLoading ? (
        <div className="h-48 rounded-xl bg-surface-container-low animate-pulse" />
      ) : inquiries.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-10 text-center space-y-2">
          <MessageSquare className="w-9 h-9 text-outline mx-auto" />
          <p className="text-title-md text-primary">Bu tedarikçiye ait gelen talep henüz yok.</p>
          <p className="text-body-sm text-outline">
            Pazaryerindeki herhangi bir üründen &quot;Teklif İste&quot; formunu doldurarak test edebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-title-md font-bold text-primary">{inq.buyerCompany}</span>
                    <span className="text-label-sm text-outline">({inq.buyerContactName})</span>
                  </div>
                  <Link
                    to={
                      inq.listingCategory === 'diamond'
                        ? `/pirlanta/${inq.listingId}`
                        : `/saat/${inq.listingId}`
                    }
                    className="text-body-sm text-primary-container hover:underline font-medium"
                  >
                    {inq.listingTitle} · {inq.listingSku}
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  {inq.offerPriceUsd && (
                    <div className="text-right">
                      <div className="text-[11px] text-outline">Teklif Tutarı</div>
                      <div className="text-title-md font-bold text-tertiary-container tabular-nums">
                        {formatCurrency(inq.offerPriceUsd, currency)}
                      </div>
                    </div>
                  )}
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                    className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-2.5 py-1.5 text-label-sm font-semibold text-primary"
                  >
                    <option value="new">Yeni</option>
                    <option value="reviewing">İnceleniyor</option>
                    <option value="replied">Yanıtlandı</option>
                    <option value="closed">Kapandı</option>
                  </select>
                </div>
              </div>

              <p className="text-body-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3">
                {inq.message}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 text-label-sm text-outline">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-secondary" />
                    {inq.buyerPhone}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-secondary" />
                    {inq.buyerEmail}
                  </span>
                </div>
                <span className="font-semibold text-primary">{inq.deliveryPreference}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

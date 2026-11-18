import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { inquiryRepository, listingRepository } from '@/repositories';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency } from '@/lib/utils';
import { MediaImage } from '@/components/common/MediaImage';

const quoteSchema = z.object({
  buyerCompany: z.string().min(2, 'Firma adı en az 2 karakter olmalıdır'),
  buyerContactName: z.string().min(2, 'Yetkili adı zorunludur'),
  buyerEmail: z.string().email('Geçerli bir e-posta adresi giriniz'),
  buyerPhone: z.string().min(7, 'Geçerli bir telefon numarası giriniz'),
  offerPriceUsd: z.coerce.number().positive('Geçerli bir tutar giriniz').optional(),
  deliveryPreference: z.enum([
    'Kapalıçarşı Emanet Kasa',
    'Sigortalı Zırhlı Kurye',
    'Atölye İçi Ekspertiz',
  ]),
  message: z.string().min(5, 'Lütfen talebinizi kısaca açıklayınız'),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export function RequestQuotePage() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listingId') || '';
  const queryClient = useQueryClient();
  const { currency } = useMarketplace();
  const [submitted, setSubmitted] = useState(false);

  const { data: allListings = [] } = useQuery({
    queryKey: ['listings', 'available'],
    queryFn: () => listingRepository.getAll(false),
  });

  const selectedListing =
    allListings.find((l) => l.id === listingId) || allListings[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      deliveryPreference: 'Kapalıçarşı Emanet Kasa',
      offerPriceUsd: selectedListing?.priceUsd,
    },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    if (!selectedListing) return;
    await inquiryRepository.create({
      id: `inq-${Date.now()}`,
      listingId: selectedListing.id,
      listingTitle: selectedListing.title,
      listingSku: selectedListing.sku,
      listingCategory: selectedListing.category,
      vendorId: selectedListing.vendorId,
      buyerCompany: data.buyerCompany,
      buyerContactName: data.buyerContactName,
      buyerEmail: data.buyerEmail,
      buyerPhone: data.buyerPhone,
      offerPriceUsd: data.offerPriceUsd,
      deliveryPreference: data.deliveryPreference,
      message: data.message,
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    await queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-tertiary-fixed/50 text-on-tertiary-fixed-variant flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-headline-md text-primary">Teklif Talebiniz İletildi</h1>
          <p className="text-body-md text-on-surface-variant">
            Talebiniz yerel IndexedDB üzerinden tedarikçinin <strong>Gelen Talepler</strong> paneline kaydedildi.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/panel/talepler"
              className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md"
            >
              Tedarikçi Taleplerinde Gör
            </Link>
            <Link
              to="/pirlantalar"
              className="px-5 py-2.5 rounded-lg bg-surface-container-low text-primary text-label-md"
            >
              Pazaryerine Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      <Link
        to={selectedListing ? (selectedListing.category === 'diamond' ? `/pirlanta/${selectedListing.id}` : `/saat/${selectedListing.id}`) : '/'}
        className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        İlana Geri Dön
      </Link>

      <div>
        <h1 className="text-headline-lg-mobile sm:text-headline-lg text-primary">
          B2B Teklif Talebi
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          İlgilendiğiniz stok için karşı teklif tutarınızı ve güvenli teslimat tercihinizi tedarikçiye iletin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Selected Listing Summary */}
        {selectedListing && (
          <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 space-y-4">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container">
              <MediaImage media={selectedListing.media[0]} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-label-sm text-outline tabular-nums">SKU: {selectedListing.sku}</span>
              <h2 className="text-title-md font-bold text-primary mt-0.5">{selectedListing.title}</h2>
              <div className="text-headline-sm text-primary font-bold tabular-nums mt-2">
                {formatCurrency(selectedListing.priceUsd, currency)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-low text-label-sm text-on-surface-variant flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-tertiary-container shrink-0" />
              <span>Emanet kasa ve bağımsız ekspertiz güvencesiyle işlem yapılır.</span>
            </div>
          </div>
        )}

        {/* Quote Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-semibold text-primary mb-1">
                Alıcı Firma / Atölye Adı *
              </label>
              <input
                {...register('buyerCompany')}
                placeholder="Örn. Karat Mücevherat Ltd."
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
              />
              {errors.buyerCompany && (
                <p className="text-label-sm text-error mt-1">{errors.buyerCompany.message}</p>
              )}
            </div>
            <div>
              <label className="block text-label-sm font-semibold text-primary mb-1">
                Yetkili Adı Soyadı *
              </label>
              <input
                {...register('buyerContactName')}
                placeholder="Örn. Ahmet Demir"
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
              />
              {errors.buyerContactName && (
                <p className="text-label-sm text-error mt-1">{errors.buyerContactName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-semibold text-primary mb-1">
                Kurumsal E-posta *
              </label>
              <input
                type="email"
                {...register('buyerEmail')}
                placeholder="satin-alma@firma.com"
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
              />
              {errors.buyerEmail && (
                <p className="text-label-sm text-error mt-1">{errors.buyerEmail.message}</p>
              )}
            </div>
            <div>
              <label className="block text-label-sm font-semibold text-primary mb-1">
                Telefon Numarası *
              </label>
              <input
                {...register('buyerPhone')}
                placeholder="+90 532 000 00 00"
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
              />
              {errors.buyerPhone && (
                <p className="text-label-sm text-error mt-1">{errors.buyerPhone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-semibold text-primary mb-1">
                Teklif Tutarı (USD)
              </label>
              <input
                type="number"
                {...register('offerPriceUsd')}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block text-label-sm font-semibold text-primary mb-1">
                Teslimat &amp; Ekspertiz Tercihi
              </label>
              <select
                {...register('deliveryPreference')}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
              >
                <option value="Kapalıçarşı Emanet Kasa">Kapalıçarşı Emanet Kasa</option>
                <option value="Sigortalı Zırhlı Kurye">Sigortalı Zırhlı Kurye</option>
                <option value="Atölye İçi Ekspertiz">Atölye İçi Ekspertiz</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Not &amp; İnceleme Talebi *
            </label>
            <textarea
              rows={4}
              {...register('message')}
              placeholder="Taş/saat inceleme randevusu veya ödeme koşulları hakkında notunuz..."
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
            {errors.message && (
              <p className="text-label-sm text-error mt-1">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedListing}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-primary-container text-on-primary text-title-md hover:bg-primary transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Gönderiliyor...' : 'Teklif Talebini Gönder'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { vendorRepository } from '@/repositories';
import { useMarketplace } from '@/context/MarketplaceContext';

const createVendorSchema = z.object({
  companyName: z.string().min(3, 'Firma ünvanı en az 3 karakter olmalıdır'),
  city: z.string().min(2, 'Şehir zorunludur'),
  district: z.string().min(2, 'İlçe / Merkez zorunludur'),
  chamberRegistrationNo: z.string().min(3, 'Oda / Sicil numarası zorunludur'),
  specialty: z.enum(['Pırlanta', 'Saat', 'Pırlanta & Saat']),
  phone: z.string().min(7, 'Telefon numarası zorunludur'),
  email: z.string().email('Geçerli e-posta giriniz'),
  foundedYear: z.coerce.number().min(1900).max(2026),
  about: z.string().min(10, 'Firma hakkında kısa bilgi giriniz'),
});

type CreateVendorValues = z.infer<typeof createVendorSchema>;

export function CreateVendorPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setActiveVendorId } = useMarketplace();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateVendorValues>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      city: 'İstanbul',
      district: 'Kapalıçarşı / Fatih',
      specialty: 'Pırlanta & Saat',
      foundedYear: 2018,
    },
  });

  const onSubmit = async (values: CreateVendorValues) => {
    const id = `vendor-${Date.now()}`;
    await vendorRepository.create({
      id,
      ...values,
      verified: true,
      rating: 5.0,
      completedTrades: 0,
      createdAt: new Date().toISOString(),
    });
    await queryClient.invalidateQueries({ queryKey: ['vendors'] });
    setActiveVendorId(id);
    navigate('/panel');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-md sm:text-headline-lg text-primary">
          Yeni Demo Tedarikçi Profili Oluştur
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Oluşturduğunuz tedarikçi IndexedDB&apos;ye kaydedilir ve otomatik olarak aktif demo tedarikçiniz seçilir.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 space-y-4 max-w-3xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Firma Ünvanı *
            </label>
            <input
              {...register('companyName')}
              placeholder="Örn. Marmara Pırlanta A.Ş."
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
            {errors.companyName && (
              <p className="text-label-sm text-error mt-1">{errors.companyName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Uzmanlık Alanı *
            </label>
            <select
              {...register('specialty')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            >
              <option value="Pırlanta & Saat">Pırlanta &amp; Saat</option>
              <option value="Pırlanta">Pırlanta</option>
              <option value="Saat">Saat</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">Şehir *</label>
            <input
              {...register('city')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
            {errors.city && (
              <p className="text-label-sm text-error mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Bölge / Çarşı *
            </label>
            <input
              {...register('district')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
          </div>
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Oda Sicil No *
            </label>
            <input
              {...register('chamberRegistrationNo')}
              placeholder="İKO-60123"
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
            {errors.chamberRegistrationNo && (
              <p className="text-label-sm text-error mt-1">
                {errors.chamberRegistrationNo.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Telefon *
            </label>
            <input
              {...register('phone')}
              placeholder="+90 212 000 00 00"
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
            {errors.phone && (
              <p className="text-label-sm text-error mt-1">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              E-posta *
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="info@firma.example"
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
            {errors.email && (
              <p className="text-label-sm text-error mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Kuruluş Yılı *
            </label>
            <input
              type="number"
              {...register('foundedYear')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm tabular-nums"
            />
          </div>
        </div>

        <div>
          <label className="block text-label-sm font-semibold text-primary mb-1">
            Firma Hakkında *
          </label>
          <textarea
            rows={3}
            {...register('about')}
            placeholder="Stok uzmanlıklarınız ve emanet kasa bilgileriniz..."
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
          />
          {errors.about && (
            <p className="text-label-sm text-error mt-1">{errors.about.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-container text-on-primary text-title-md hover:bg-primary transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isSubmitting ? 'Oluşturuluyor...' : 'Tedarikçi Profilini Oluştur'}</span>
        </button>
      </form>
    </div>
  );
}

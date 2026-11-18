import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, CheckCircle2 } from 'lucide-react';
import { vendorRepository } from '@/repositories';
import { useMarketplace } from '@/context/MarketplaceContext';

const settingsSchema = z.object({
  companyName: z.string().min(3),
  city: z.string().min(2),
  district: z.string().min(2),
  chamberRegistrationNo: z.string().min(3),
  specialty: z.enum(['Pırlanta', 'Saat', 'Pırlanta & Saat']),
  phone: z.string().min(7),
  email: z.string().email(),
  about: z.string().min(10),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export function VendorSettingsPage() {
  const { activeVendorId } = useMarketplace();
  const queryClient = useQueryClient();
  const [savedBanner, setSavedBanner] = useState(false);

  const { data: vendor } = useQuery({
    queryKey: ['vendor', activeVendorId],
    queryFn: () => vendorRepository.getById(activeVendorId),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (vendor) {
      reset({
        companyName: vendor.companyName,
        city: vendor.city,
        district: vendor.district,
        chamberRegistrationNo: vendor.chamberRegistrationNo,
        specialty: vendor.specialty,
        phone: vendor.phone,
        email: vendor.email,
        about: vendor.about,
      });
    }
  }, [vendor, reset]);

  const onSubmit = async (values: SettingsValues) => {
    if (!vendor) return;
    await vendorRepository.update(vendor.id, values);
    await queryClient.invalidateQueries({ queryKey: ['vendors'] });
    await queryClient.invalidateQueries({ queryKey: ['vendor', vendor.id] });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-md sm:text-headline-lg text-primary">
          Tedarikçi Profil Ayarları
        </h1>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Aktif demo tedarikçinizin firma ve iletişim bilgilerini güncelleyin.
        </p>
      </div>

      {savedBanner && (
        <div className="p-3 rounded-lg bg-tertiary-fixed/50 text-on-tertiary-fixed-variant text-body-sm font-semibold flex items-center gap-2 max-w-3xl">
          <CheckCircle2 className="w-4 h-4" />
          Tedarikçi profiliniz başarıyla güncellendi.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 space-y-4 max-w-3xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Firma Ünvanı
            </label>
            <input
              {...register('companyName')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
          </div>
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">Uzmanlık</label>
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
            <label className="block text-label-sm font-semibold text-primary mb-1">Şehir</label>
            <input
              {...register('city')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
          </div>
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Bölge / Çarşı
            </label>
            <input
              {...register('district')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
          </div>
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">
              Oda Sicil No
            </label>
            <input
              {...register('chamberRegistrationNo')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">Telefon</label>
            <input
              {...register('phone')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
          </div>
          <div>
            <label className="block text-label-sm font-semibold text-primary mb-1">E-posta</label>
            <input
              type="email"
              {...register('email')}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-label-sm font-semibold text-primary mb-1">
            Firma Hakkında
          </label>
          <textarea
            rows={3}
            {...register('about')}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md hover:bg-primary"
        >
          <Save className="w-4 h-4" />
          <span>Değişiklikleri Kaydet</span>
        </button>
      </form>
    </div>
  );
}

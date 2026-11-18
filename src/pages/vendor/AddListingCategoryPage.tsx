import { Link } from 'react-router-dom';
import { Diamond, Watch, ArrowRight } from 'lucide-react';

export function AddListingCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-label-sm uppercase tracking-wider text-secondary font-bold">
          Yeni İlan Sihirbazı
        </span>
        <h1 className="text-headline-md sm:text-headline-lg text-primary">
          Ne listelemek istiyorsunuz?
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          İlan eklemek istediğiniz varlık sınıfını seçerek teknik parametre ve medya sihirbazını başlatın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Link
          to="/panel/ilan-ekle/pirlanta"
          className="group bg-surface-container-lowest border border-outline-variant/50 hover:border-primary rounded-xl p-6 space-y-4 transition-all shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center">
            <Diamond className="w-6 h-6 text-secondary-fixed" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-headline-sm text-primary group-hover:text-primary-container">
              Pırlanta İlanı
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Doğal veya Laboratuvar (CVD/HPHT), 4C parametreleri, GIA/IGI/HRD sertifikalı veya sertifikasız pırlanta ekleyin.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-label-md text-primary font-bold pt-2">
            Pırlanta Sihirbazını Başlat <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          to="/panel/ilan-ekle/saat"
          className="group bg-surface-container-lowest border border-outline-variant/50 hover:border-primary rounded-xl p-6 space-y-4 transition-all shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center">
            <Watch className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-headline-sm text-primary group-hover:text-primary-container">
              Saat İlanı
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Marka, model, referans numarası, kondisyon, kutu &amp; sertifika durumu (sertifikalı veya sertifikasız) ve çoklu açı fotoğraflarıyla saat ilanı oluşturun.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-label-md text-primary font-bold pt-2">
            Saat Sihirbazını Başlat <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}

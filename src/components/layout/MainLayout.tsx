import { Link, Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Diamond, ShieldCheck } from 'lucide-react';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />
      <main className="flex-1 pt-20 pb-20 md:pb-0">
        <Outlet />
      </main>
      <footer className="bg-primary text-on-primary mt-16 border-t border-primary-container">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Diamond className="w-5 h-5 text-secondary-fixed" />
              <span className="font-bold text-title-md tracking-tight">ATELIER B2B</span>
            </div>
            <p className="text-body-sm text-primary-fixed-dim leading-relaxed">
              Türkiye&apos;nin sertifikalı pırlanta ve koleksiyonluk saat borsası. Doğrulanmış atölyeler arası güvenli ticaret.
            </p>
            <div className="inline-flex items-center gap-1.5 text-label-sm text-secondary-fixed">
              <ShieldCheck className="w-4 h-4" />
              <span>Kapalıçarşı &amp; Kuyumcukent Fiziksel Kasa Ağı</span>
            </div>
          </div>

          <div>
            <h4 className="text-label-md uppercase tracking-wider text-secondary-fixed mb-3">
              Pazaryeri
            </h4>
            <ul className="space-y-2 text-body-sm text-primary-fixed-dim">
              <li>
                <Link to="/pirlantalar" className="hover:text-white transition-colors">
                  Pırlantaları Keşfet
                </Link>
              </li>
              <li>
                <Link to="/pirlantalar/ara" className="hover:text-white transition-colors">
                  Detaylı Pırlanta Arama
                </Link>
              </li>
              <li>
                <Link to="/saatler" className="hover:text-white transition-colors">
                  Saat Kataloğu
                </Link>
              </li>
              <li>
                <Link to="/saatler/ara" className="hover:text-white transition-colors">
                  Referans ile Saat Ara
                </Link>
              </li>
              <li>
                <Link to="/karsilastir" className="hover:text-white transition-colors">
                  Pırlanta Karşılaştırma
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-label-md uppercase tracking-wider text-secondary-fixed mb-3">
              Tedarikçi &amp; Borsa
            </h4>
            <ul className="space-y-2 text-body-sm text-primary-fixed-dim">
              <li>
                <Link to="/tedarikciler" className="hover:text-white transition-colors">
                  Tedarikçi Dizini
                </Link>
              </li>
              <li>
                <Link to="/tedarikci-ol" className="hover:text-white transition-colors">
                  Tedarikçi Ol / Kurumsal Güvence
                </Link>
              </li>
              <li>
                <Link to="/panel" className="hover:text-white transition-colors">
                  Tedarikçi Paneli
                </Link>
              </li>
              <li>
                <Link to="/panel/envanter" className="hover:text-white transition-colors">
                  Envanter Konsolu
                </Link>
              </li>
              <li>
                <Link to="/panel/ilan-ekle" className="hover:text-white transition-colors">
                  Yeni İlan Ekle
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-label-md uppercase tracking-wider text-secondary-fixed mb-3">
              Demo Ortamı Notu
            </h4>
            <p className="text-body-sm text-primary-fixed-dim leading-relaxed">
              Bu uygulama statik B2B demo modunda çalışır. Oluşturduğunuz tedarikçi, ilan, fotoğraf ve teklif talepleri tarayıcınızın yerel IndexedDB veritabanında saklanır.
            </p>
          </div>
        </div>
        <div className="border-t border-primary-container py-4 px-4 lg:px-8 text-center text-label-sm text-on-primary-container">
          © 2026 ATELIER B2B Diamond &amp; Watch Exchange — Tüm Hakları Saklıdır.
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}

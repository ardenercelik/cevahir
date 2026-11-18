# ATELIER B2B — Pırlanta & Lüks Saat Borsası

Türkiye'nin sertifikalı toptan pırlanta ve koleksiyonluk lüks saat profesyonelleri için geliştirilmiş, Google Stitch tasarım sistemine birebir sadık, statik olarak GitHub Pages üzerinde ücretsiz barındırılabilen duyarlı (responsive) B2B pazaryeri ve tedarikçi portalı uygulaması.

## Teknoloji Yığını

- **React 18** + **TypeScript** (`strict` mod) + **Vite**
- **Tailwind CSS** (`Plus Jakarta Sans` tipografi, `#f9f9ff` / `#002449` / `#6d5c3a` tasarım tokenları)
- **React Router** (`HashRouter` — GitHub Pages yenileme 404 koruması)
- **TanStack Query** (veri önbellekleme ve asenkron durum yönetimi)
- **React Hook Form** + **Zod** (form doğrulama)
- **Dexie (IndexedDB)** (yerel demo veritabanı ve görsel `Blob` depolama)
- **Lucide Icons**

## Yerel Kurulum ve Çalıştırma

```bash
npm install
npm run dev
```

Üretim derlemesi ve tip kontrolü:

```bash
npm run lint
npm run build
npm run preview
```

## GitHub Pages Üzerinde Yayınlama

Proje `.github/workflows/deploy.yml` ile otomatik GitHub Actions dağıtımına hazırdır:

1. Depoyu GitHub'a (`main` dalına) push edin.
2. GitHub Repo Settings → **Pages** → Source bölümünden **GitHub Actions** seçeneğini aktif edin.
3. Her push işleminde `VITE_BASE_PATH=/<repo-adi>/` ortam değişkeniyle statik derleme alınır ve yayınlanır.

## Yerel Demo Depolama ve Simüle Edilen Akışlar

Bu sürüm tamamen sunucusuz (statik) çalışır:
- İlk açılışta `src/data/seed*.json` dosyalarındaki örnek tedarikçiler, pırlantalar, saatler ve talepler otomatik olarak tarayıcının **IndexedDB** (`atelier_b2b_cevahir_db`) veritabanına yüklenir.
- Oluşturduğunuz yeni tedarikçiler, eklediğiniz/düzenlediğiniz/kopyaladığınız/sildiğiniz ilanlar, durum değişiklikleri (`Taslak`, `Mevcut`, `Rezerve`, `Satıldı`, `Arşiv`), yerel fotoğraf yüklemeleri (`Blob`) ve gönderilen teklif talepleri IndexedDB'de saklanır.
- Para birimi tercihi (`USD`/`TRY`), aktif demo tedarikçi seçimi, favoriler ve pırlanta karşılaştırma listesi `localStorage` üzerinde tutulur.

## Dokümantasyon

- [docs/SCREEN_INVENTORY.md](docs/SCREEN_INVENTORY.md) — Google Stitch ekran analizi ve 23 sayfa envanteri
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Katmanlı mimari, repository arayüzleri ve veri akışı
- [docs/PRODUCTION_MIGRATION.md](docs/PRODUCTION_MIGRATION.md) — Gerçek backend, PostgreSQL ve kimlik doğrulama geçiş rehberi

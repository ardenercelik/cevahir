# Mimari Dokümantasyon (Architecture)

## 1. Katmanlı Yapı

Uygulama, UI bileşenlerini veri kaynağından tamamen ayıran **Repository Pattern** üzerine kurulmuştur:

```text
src/
├── domain/
│   └── types.ts                  # Çekirdek domain modelleri (DiamondListing, WatchListing, Vendor, Inquiry)
├── data/
│   ├── seedVendors.json          # Başlangıç tedarikçi verileri
│   ├── seedDiamonds.json         # Başlangıç pırlanta stoğu
│   ├── seedWatches.json          # Başlangıç saat stoğu
│   └── seedInquiries.json        # Örnek gelen talepler
├── infrastructure/
│   └── db/atelierDb.ts           # Dexie IndexedDB şeması ve tek seferlik seed mekanizması
├── repositories/
│   ├── interfaces.ts             # ListingRepository, VendorRepository, InquiryRepository, MediaRepository
│   ├── local/                    # IndexedDB (Dexie) tabanlı yerel implementasyonlar
│   └── index.ts                  # Uygulama genelinde kullanılan repository singleton'ları
├── context/
│   └── MarketplaceContext.tsx    # Küçük UI tercihleri (USD/TRY, favoriler, karşılaştırma, aktif demo tedarikçi)
├── components/                   # Paylaşılan layout, kart, görsel ve form bileşenleri
└── pages/                        # 12 Pazaryeri + 11 Tedarikçi Portalı sayfası
```

## 2. Veri Akışı ve Senkronizasyon

- Tüm sayfalar doğrudan `db.*` yerine `@/repositories` üzerinden `listingRepository`, `vendorRepository`, `inquiryRepository` ve `mediaRepository` arayüzlerini kullanır.
- **TanStack Query** (`queryKey`) aracılığıyla tedarikçi panelinde yapılan her ekleme, düzenleme, durum değişikliği (`draft`, `available`, `reserved`, `sold`, `archived`) veya silme işlemi sonrasında ilgili sorgular geçersiz kılınır (`invalidateQueries`) ve pazaryeri listeleri anında güncellenir.
- Yerel fotoğraf yüklemeleri `LocalMediaRepository` üzerinden `Blob` olarak `db.media` tablosuna yazılır ve `MediaImage` bileşeni `URL.createObjectURL` ile görselleri güvenli şekilde render eder.
- Pırlanta ve saat kataloglarında seçilen filtreler URL arama parametrelerinde (`useSearchParams`) tutulur; böylece ürün detay sayfasından geri dönüldüğünde filtreler korunur.

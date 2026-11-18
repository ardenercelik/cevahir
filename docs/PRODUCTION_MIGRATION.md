# Üretim Ortamına Geçiş Rehberi (Production Migration)

Bu uygulama, ileride frontend bileşenlerini yeniden yazmadan gerçek bir backend, PostgreSQL veritabanı ve çoklu tedarikçi kimlik doğrulaması eklenecek şekilde tasarlanmıştır.

## 1. Repository Arayüzlerini HTTP API ile Değiştirme

UI bileşenleri yalnızca `src/repositories/interfaces.ts` içindeki sözleşmeleri bilir:

- `ListingRepository`
- `VendorRepository`
- `InquiryRepository`
- `MediaRepository`

Üretim geçişi için `src/repositories/http/` klasörü altında `HttpListingRepository`, `HttpVendorRepository`, `HttpInquiryRepository` ve `HttpMediaRepository` sınıflarını oluşturup `src/repositories/index.ts` içindeki export'ları değiştirmeniz yeterlidir.

## 2. PostgreSQL Veritabanı Şeması Önerisi

- **`vendors`**: `id (UUID PK)`, `company_name`, `city`, `district`, `chamber_registration_no`, `specialty`, `verified`, `rating`, `completed_trades`, `phone`, `email`, `about`, `founded_year`, `created_at`
- **`listings`**: `id (UUID PK)`, `sku (UNIQUE)`, `category ('diamond' | 'watch')`, `vendor_id (FK -> vendors.id)`, `status ('draft' | 'available' | 'reserved' | 'sold' | 'archived')`, `title`, `price_usd`, `vault_location`, `description`, `created_at`, `updated_at`
- **`diamond_specs`**: `listing_id (PK/FK)`, `origin`, `shape`, `carat`, `color`, `clarity`, `cut`, `polish`, `symmetry`, `fluorescence`, `cert_lab`, `cert_number`, `measurements`, `depth_percent`, `table_percent`, `ratio`, `rapaport_discount_percent`
- **`watch_specs`**: `listing_id (PK/FK)`, `brand`, `model`, `reference_number`, `production_year`, `condition`, `has_box`, `has_papers`, `case_material`, `case_diameter_mm`, `dial_color`, `movement`, `caliber`, `power_reserve_hours`, `bracelet_material`, `water_resistance_m`
- **`listing_media`**: `id (UUID PK)`, `listing_id (FK)`, `storage_key` (S3/R2/GCS), `cdn_url`, `sort_order`
- **`inquiries`**: `id (UUID PK)`, `listing_id (FK)`, `vendor_id (FK)`, `buyer_company`, `buyer_contact_name`, `buyer_email`, `buyer_phone`, `offer_price_usd`, `delivery_preference`, `message`, `status`, `created_at`

## 3. Gerçek Tedarikçi Kimlik Doğrulaması (Auth) Ekleme

1. Demo modundaki `MarketplaceContext.activeVendorId` seçicisi yerine JWT / HTTP-only session cookie tabanlı bir `AuthProvider` ekleyin.
2. `/panel/*` rotalarını `<ProtectedRoute>` ile sarmalayın.
3. Backend'de her `POST /listings`, `PATCH /listings/:id`, `DELETE /listings/:id` ve `GET /inquiries` isteğinde oturum açmış kullanıcının `vendor_id` yetkisini doğrulayın.
4. `MediaRepository.saveFile(file)` metodunu doğrudan S3/Cloudflare R2 imzalı URL (presigned URL) yüklemesi yapacak şekilde güncelleyin.

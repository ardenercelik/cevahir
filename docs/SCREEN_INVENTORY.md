# Ekran Envanteri ve Tasarım Eşleştirme (Screen Inventory)

Bu doküman, `/Users/laviniaingilizoglu/Downloads/cevahir` dizinindeki tüm Google Stitch tasarım çıktılarını analiz eder; masaüstü (`1440px`) ve mobil (`390px`) referansları, tekrarlayan/eksik ekranları, hedef React Router (`HashRouter`) rotalarını ve fonksiyonel gereksinimleri eşleştirir.

---

## 1. Google Stitch Tasarım Klasörleri Analizi

| # | Stitch Klasör Adı | Platform | Dosyalar | Açıklama / Rol | Eşleşen Rota |
|---|---|---|---|---|---|
| 1 | `atelier_b2b_ana_sayfa` | Masaüstü | `code.html`, `screen.png` | Ana sayfa: Pırlanta & Saat B2B pazaryeri vitrini, Rapaport ticker, doğal/lab kartları, 10 kesim formu, son eklenen taşlar | `/` |
| 2 | `atelier_b2b_mobil_ana_sayfa` | Mobil | `code.html`, `screen.png` | Mobil ana sayfa: Kompakt hero, hızlı kategori kartları, kesim formu yatay şerit, öne çıkan saat markaları, alt navigasyon | `/` |
| 3 | `atelier_b2b_kurumsal_borsa_landing_page` | Masaüstü | `code.html`, `screen.png` | Kurumsal Borsa Landing Page: 4 kademeli güvenlik protokolü, davet/üyelik başvurusu akışı (Tedarikçi Ol / Kurumsal Güvence) | `/kurumsal` & `/tedarikci-ol` |
| 4 | `atelier_b2b_p_rlantalar_ke_fet` | Masaüstü | `code.html`, `screen.png` | Pırlanta Arama & Listeleme: Doğal/Lab toggle, 10 vektör kesim formu, sol 4C filtre paneli, tablo/kart görünümü, karşılaştırma | `/pirlantalar` |
| 5 | `atelier_b2b_mobil_p_rlanta_arama` | Mobil | `code.html`, `screen.png` | Mobil Pırlanta Arama: Kompakt kart listesi, alt çekmece (drawer) detaylı filtreleme, sıralama | `/pirlantalar` |
| 6 | `atelier_b2b_p_rlanta_detay_d_10482_oval` | Masaüstü | `code.html` | Pırlanta Detay (`D-10482`): Galeri, GIA/IGI sertifika rozeti, 4C & gemolojik teknik tablo, tedarikçi kartı, alternatif taşlar, teklif talebi | `/pirlanta/:id` |
| 7 | `atelier_b2b_mobil_p_rlanta_detay_d_10482` | Mobil | `code.html` | Mobil Pırlanta Detay: Swipe galeri, teknik metrik kartları, sabit alt teklif/favori çubuğu | `/pirlanta/:id` |
| 8 | `atelier_b2b_l_ks_saatler` | Masaüstü | `code.html`, `screen.png` | Lüks Saatler Kataloğu: Marka/model/referans arama, kondisyon, yıl, kutu/sertifika filtreleri, grid/tablo görünümü | `/saatler` |
| 9 | `atelier_b2b_mobil_l_ks_saatler` | Mobil | `code.html`, `screen.png` | Mobil Lüks Saatler: Marka çipleri, saat kartları, ekspertiz ve güvenli kasa prosedürü banner'ı | `/saatler` |
| 10 | `atelier_b2b_l_ks_saat_detay_rolex_gmt_master_ii` | Masaüstü | `code.html` | Lüks Saat Detay: Çoklu açı galeri, kasa/kadran/mekanizma/set & garanti tabloları, benzer saatler, B2B teklif talebi | `/saat/:id` |
| 11 | `atelier_b2b_mobil_saat_detay_rolex_gmt_master_ii` | Mobil | `code.html` | Mobil Lüks Saat Detay: Mobil galeri, özet metrikler, teklif talebi alt çubuğu | `/saat/:id` |
| 12 | `atelier_b2b_stok_y_netimi_envanter_konsolu` | Masaüstü | `code.html`, `screen.png` | Tedarikçi Envanter Konsolu: KPI özet kartları, durum filtreleri (Taslak/Mevcut/Rezerve/Satıldı/Arşiv), tablo, hızlı işlemler | `/panel/envanter` |
| 13 | `atelier_b2b_mobil_stok_y_netimi` | Mobil | `code.html`, `screen.png` | Mobil Stok Yönetimi: Envanter kartları, durum rozetleri, hızlı durum değiştirme ve düzenleme | `/panel/envanter` |
| 14 | `atelier_b2b_yeni_i_lan_ekleme_sihirbaz` | Masaüstü | `code.html`, `screen.png` | Yeni İlan Ekleme Sihirbazı: Kategori seçimi (Pırlanta / Saat) + 3 adımlı Pırlanta ekleme formu (4C, Görsel/Sertifika, Fiyat/Emanet) | `/panel/ilan-ekle`, `/panel/ilan-ekle/pirlanta` |
| 15 | `atelier_b2b_mobil_yeni_i_lan_ekleme_sihirbaz` | Mobil | `code.html`, `screen.png` | Mobil Yeni İlan Sihirbazı: Adım göstergeli mobil pırlanta ekleme formu | `/panel/ilan-ekle`, `/panel/ilan-ekle/pirlanta` |
| 16 | `atelier_b2b_saat_ekleme_sihirbaz_desktop` | Masaüstü | `code.html`, `screen.png` | Masaüstü Saat Ekleme Sihirbazı: Marka/model, kondisyon/seri no, 6 açılı fotoğraf yükleme, B2B fiyatlama ve emanet kasası | `/panel/ilan-ekle/saat` |
| 17 | `atelier_b2b_saat_ekleme_sihirbaz` | Masaüstü (Taslak) | `code.html` | Saat Ekleme Sihirbazı erken/kısa versiyonu (`atelier_b2b_saat_ekleme_sihirbaz_desktop` ile birleştirildi — tekrar eden ekran) | `/panel/ilan-ekle/saat` |
| 18 | `atelier_b2b_mobil_saat_ekleme_sihirbaz` | Mobil | `code.html`, `screen.png` | Mobil Saat Ekleme Sihirbazı: Adım adım mobil saat ilanı formu | `/panel/ilan-ekle/saat` |
| 19 | `atelier_b2b_diamond_exchange` | Sistem | `DESIGN.md` | Tasarım Sistemi Dokümanı: Renk paleti, tipografi (`Plus Jakarta Sans`), grid, bileşen spesifikasyonları | — |
| 20 | `atelier_b2b_diamond_exchange_2` | Sistem | `DESIGN.md` | `atelier_b2b_diamond_exchange/DESIGN.md` ile birebir aynı (tekrarlayan dosya) | — |

---

## 2. Zorunlu Uygulama Sayfaları Envanteri (23 Sayfa)

### A. Pazaryeri (Marketplace) — 12 Sayfa

| # | Sayfa Adı | Masaüstü Referans | Mobil Referans | Hedef Rota | Gerekli Fonksiyonlar & Navigasyon | Durum |
|---|---|---|---|---|---|---|
| 1 | Ana Sayfa (Homepage) | `atelier_b2b_ana_sayfa` | `atelier_b2b_mobil_ana_sayfa` | `/` | Rapaport/kur ticker, Doğal/Lab kartları, 10 kesim formu kısa yolu, saat markaları, son eklenen ilanlar, Pırlantalar / Saatler / İlan Ekle yönlendirmeleri | Tamamlandı |
| 2 | Pırlanta Arama (Diamond Search) | `atelier_b2b_p_rlantalar_ke_fet` | `atelier_b2b_mobil_p_rlanta_arama` | `/pirlantalar/ara` | Doğal/Lab seçimi, kesim formu, karat/renk/berraklık/kesim/fiyat/sertifika filtreleriyle doğrudan `/pirlantalar` sonuçlarına yönlendirme (veya birleşik arama görünümü) | Tamamlandı |
| 3 | Pırlanta İlanları (Diamond Listings) | `atelier_b2b_p_rlantalar_ke_fet` | `atelier_b2b_mobil_p_rlanta_arama` | `/pirlantalar` | Doğal/Lab sekmesi, 10 kesim ikonu, karat/renk/berraklık/kesim/fiyat/sertifika/gelişmiş filtreler, sıralama, Grid/Tablo görünümü, favori & karşılaştırma ekleme, detaydan dönüşte filtrelerin korunması | Tamamlandı |
| 4 | Pırlanta Detay (Diamond Detail) | `atelier_b2b_p_rlanta_detay_d_10482_oval` | `atelier_b2b_mobil_p_rlanta_detay_d_10482` | `/pirlanta/:id` | Çoklu görsel galerisi, GIA/IGI/HRD rozeti, tam 4C & ölçü tablosu, tedarikçi profili bağlantısı, favorilere ekle, karşılaştırmaya ekle, Teklif İste akışı | Tamamlandı |
| 5 | Lüks Saat Arama (Watch Search) | `atelier_b2b_l_ks_saatler` | `atelier_b2b_mobil_l_ks_saatler` | `/saatler/ara` | Marka, model, referans no, kondisyon, üretim yılı, kutu/sertifika hızlı arama ve `/saatler` kataloğuna aktarım | Tamamlandı |
| 6 | Lüks Saat İlanları (Watch Listings) | `atelier_b2b_l_ks_saatler` | `atelier_b2b_mobil_l_ks_saatler` | `/saatler` | Marka, model, referans arama, fiyat, kondisyon, üretim yılı, kutu & sertifika filtreleri, sıralama, Grid/Tablo görünümü, favori ekleme | Tamamlandı |
| 7 | Lüks Saat Detay (Watch Detail) | `atelier_b2b_l_ks_saat_detay_rolex_gmt_master_ii` | `atelier_b2b_mobil_saat_detay_rolex_gmt_master_ii` | `/saat/:id` | Çoklu açı fotoğraf galerisi, kasa/kadran/mekanizma/set & garanti tabloları, tedarikçi bağlantısı, favorilere ekle, Teklif İste | Tamamlandı |
| 8 | Favoriler (Favorites) | *Tasarım Sistemi (`DESIGN.md`)* | *Tasarım Sistemi (`DESIGN.md`)* | `/favoriler` | Kaydedilen pırlanta ve saat ilanlarını listeleme, kategori filtresi, karşılaştırmaya aktarma, favoriden çıkarma, detaya gitme | Tamamlandı (Tasarım Sistemi ile) |
| 9 | Pırlanta Karşılaştırma (Comparison) | *Tasarım Sistemi (`DESIGN.md`)* | *Tasarım Sistemi (`DESIGN.md`)* | `/karsilastir` | Seçilen pırlantaların 4C, ölçü, sertifika, fiyat/karat ve Rapaport iskonto oranlarını yan yana karşılaştırma, kaldırma, teklif isteme | Tamamlandı (Tasarım Sistemi ile) |
| 10 | Tedarikçi Dizini (Supplier Directory) | `atelier_b2b_kurumsal_borsa_landing_page` + *Tasarım Sistemi* | *Tasarım Sistemi* | `/tedarikciler` | Doğrulanmış B2B tedarikçiler listesi, şehir/uzmanlık filtresi, aktif ilan sayısı, güven rozetleri, tedarikçi profiline geçiş | Tamamlandı (Tasarım Sistemi ile) |
| 11 | Tedarikçi Profili (Supplier Profile) | *Tasarım Sistemi (`DESIGN.md`)* | *Tasarım Sistemi (`DESIGN.md`)* | `/tedarikci/:id` | Firma bilgileri, doğrulama rozetleri, lokasyon, tedarikçinin aktif pırlanta & saat ilanları, doğrudan teklif isteme | Tamamlandı (Tasarım Sistemi ile) |
| 12 | Teklif İste (Request Quote) | `atelier_b2b_p_rlanta_detay_d_10482_oval` & `..._saat_detay_...` alt formu | `atelier_b2b_mobil_p_rlanta_detay_...` | `/teklif-iste` | İlan/tedarikçi seçili teklif formu, karşı teklif tutarı, teslimat/kasa tercihi, notlar; gönderilen teklif IndexedDB (`InquiryRepository`) üzerinden satıcı paneline düşer | Tamamlandı |

### B. Tedarikçi Portalı (Vendor Portal) — 11 Sayfa

| # | Sayfa Adı | Masaüstü Referans | Mobil Referans | Hedef Rota | Gerekli Fonksiyonlar & Navigasyon | Durum |
|---|---|---|---|---|---|---|
| 13 | Tedarikçi Ol (Become a Vendor) | `atelier_b2b_kurumsal_borsa_landing_page` | *Tasarım Sistemi* | `/tedarikci-ol` | Kurumsal borsa avantajları, 4 kademeli güvenlik protokolü, mevcut demo tedarikçi seçme veya yeni tedarikçi profili oluşturmaya geçiş | Tamamlandı |
| 14 | Tedarikçi Profili Oluştur (Create Vendor) | *Tasarım Sistemi (`DESIGN.md`)* | *Tasarım Sistemi* | `/panel/tedarikci-olustur` | React Hook Form + Zod ile yeni demo tedarikçi oluşturma (Firma adı, şehir, oda sicil/vergi no, uzmanlık), IndexedDB'ye kayıt ve aktif tedarikçi seçimi | Tamamlandı (Tasarım Sistemi ile) |
| 15 | Tedarikçi Paneli (Vendor Dashboard) | `atelier_b2b_stok_y_netimi_envanter_konsolu` | `atelier_b2b_mobil_stok_y_netimi` | `/panel` | Aktif tedarikçi seçici, envanter KPI'ları (Toplam değer, Mevcut/Rezerve/Satıldı/Taslak), gelen teklif özeti, hızlı aksiyonlar (+ İlan Ekle, Envanter, Gelen Teklifler) | Tamamlandı |
| 16 | Tedarikçi Envanteri (Vendor Inventory) | `atelier_b2b_stok_y_netimi_envanter_konsolu` | `atelier_b2b_mobil_stok_y_netimi` | `/panel/envanter` | Durum sekmeleri (Tümü, Taslak, Mevcut, Rezerve, Satıldı, Arşiv), arama, durum değiştirme, düzenle, kopyala (duplicate), sil, önizle | Tamamlandı |
| 17 | İlan Kategorisi Seçimi (Add Listing Category) | `atelier_b2b_yeni_i_lan_ekleme_sihirbaz` (Üst seçim) | `atelier_b2b_mobil_yeni_i_lan_ekleme_sihirbaz` | `/panel/ilan-ekle` | Pırlanta veya Lüks Saat ilanı oluşturma seçimi, taslak devam ettirme seçeneği | Tamamlandı |
| 18 | Pırlanta Ekle (Add Diamond) | `atelier_b2b_yeni_i_lan_ekleme_sihirbaz` | `atelier_b2b_mobil_yeni_i_lan_ekleme_sihirbaz` | `/panel/ilan-ekle/pirlanta` | 3 adımlı sihirbaz (4C teknik parametreler, yerel fotoğraf yükleme & sertifika, toptan fiyatlama & emanet), Önizleme veya Taslak/Yayınla | Tamamlandı |
| 19 | Saat Ekle (Add Watch) | `atelier_b2b_saat_ekleme_sihirbaz_desktop` | `atelier_b2b_mobil_saat_ekleme_sihirbaz` | `/panel/ilan-ekle/saat` | 4 bölümlü sihirbaz (Marka/model/ref, kondisyon/kutu/sertifika, çoklu yerel fotoğraf yükleme, fiyatlama & emanet), Önizleme veya Taslak/Yayınla | Tamamlandı |
| 20 | İlan Düzenle (Edit Listing) | `atelier_b2b_yeni_i_lan_ekleme_sihirbaz` / `...saat_ekleme...` | `atelier_b2b_mobil_...` | `/panel/ilan-duzenle/:id` | Mevcut pırlanta veya saat ilanını IndexedDB'den yükleyip tüm alanlarını ve yerel fotoğraflarını düzenleme, kaydetme | Tamamlandı |
| 21 | İlan Önizleme (Listing Preview) | `atelier_b2b_p_rlanta_detay_...` / `..._saat_detay_...` | Mobil detay referansları | `/panel/onizleme/:id` (veya sihirbaz içi önizleme) | Yayınlamadan önce ilanın pazaryerinde nasıl görüneceğini birebir önizleme, "Düzenlemeye Dön" ve "Yayınla (Mevcut)" aksiyonları | Tamamlandı |
| 22 | Gelen Talepler (Incoming Inquiries) | *Tasarım Sistemi (`DESIGN.md`)* | *Tasarım Sistemi* | `/panel/talepler` | Alıcılardan gelen teklif/fiyat taleplerini görüntüleme, durum güncelleme (Yeni, İnceleniyor, Yanıtlandı, Kapandı), ilgili ilana gitme | Tamamlandı (Tasarım Sistemi ile) |
| 23 | Tedarikçi Profil Ayarları (Vendor Settings) | *Tasarım Sistemi (`DESIGN.md`)* | *Tasarım Sistemi* | `/panel/ayarlar` | Aktif demo tedarikçinin firma bilgilerini, iletişim/lokasyon detaylarını ve doğrulama bilgilerini düzenleme | Tamamlandı (Tasarım Sistemi ile) |

---

## 3. Eksik Ekranlar ve Tasarım Varsayımları

Google Stitch dışa aktarımlarında doğrudan HTML/PNG karşılığı bulunmayan 7 ekran (**Favoriler**, **Pırlanta Karşılaştırma**, **Tedarikçi Dizini**, **Tedarikçi Profili**, **Tedarikçi Profili Oluştur**, **Gelen Talepler**, **Tedarikçi Profil Ayarları**) için `DESIGN.md` dosyasında tanımlanan **Atelier B2B Diamond Exchange** tasarım sistemi (renk tokenları `#f9f9ff` zemin, `#002449` / `#193a63` derin lacivert, `#6d5c3a` / `#f7e0b4` şampanya altın, `#004236` zümrüt, `Plus Jakarta Sans` tipografi, `1px` hairline sınırlar, `tabular-nums` sayısal hizalama ve duyarlı 12/8/4 sütun grid) birebir uygulanacaktır.

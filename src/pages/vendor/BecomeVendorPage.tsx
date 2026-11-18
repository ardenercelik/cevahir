import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  ArrowRight,
  Building2,
  Watch,
  Diamond,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { vendorRepository } from '@/repositories';
import { useMarketplace } from '@/context/MarketplaceContext';
import { cn, resolveAssetUrl } from '@/lib/utils';

export function BecomeVendorPage() {
  const navigate = useNavigate();
  const { setActiveVendorId } = useMarketplace();
  const [terminalTab, setTerminalTab] = useState<'code' | 'referral'>('code');
  const [inviteCode, setInviteCode] = useState('ATL-8942-TK');
  const [vkn, setVkn] = useState('1840291842');
  const [terminalNotice, setTerminalNotice] = useState<string | null>(null);

  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => vendorRepository.getAll(),
  });

  const handleSelectDemoVendor = (id: string) => {
    setActiveVendorId(id);
    navigate('/panel');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTerminalNotice(
      `Davet kodu (${inviteCode}) doğrulandı! Demo tedarikçi paneline yönlendiriliyorsunuz...`
    );
    setTimeout(() => {
      navigate('/panel');
    }, 900);
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/panel/tedarikci-olustur');
  };

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: Institutional Hero with Right Visual Mosaic */}
      <section className="relative w-full px-4 lg:px-8 py-10 lg:py-16 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-primary text-label-md">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
              <span className="tracking-wider uppercase font-bold">Kapalı Devre Borsa Ağı</span>
              <span className="text-outline">/</span>
              <span className="text-secondary font-data-mono font-semibold">Yalnızca Onaylı Üyeler</span>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant text-label-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-tertiary-container" />
                İKO Oda Sicil Tescilli
              </span>
              <span className="text-outline-variant">•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4 text-secondary" />
                Çift Taraflı Emanet Kasası
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-data-mono text-data-mono text-secondary tracking-widest uppercase font-semibold">
                  Institutional High-Jewelry &amp; Horology Settlement
                </span>
                <h1 className="text-headline-lg-mobile sm:text-display-lg text-primary tracking-tight">
                  Güven, Referans ve Bağımsız Denetimle Güçlendirilmiş{' '}
                  <span className="text-surface-tint">B2B Mücevherat &amp; Saat Borsası</span>
                </h1>
              </div>
              <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Atelier B2B; perakendeye kapalı, yalnızca akredite kuyumcu atölyeleri ve saat tüccarlarının fiziki emanet kasaları üzerinden takas yaptığı yüksek güvenlikli kurumsal ticaret platformudur.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#davet-giris"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg shadow-md hover:bg-primary-container transition-all text-title-md"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Davet Kodu İle Giriş Yap</span>
                </a>
                <Link
                  to="/panel/tedarikci-olustur"
                  className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-primary px-5 py-3 rounded-lg shadow-sm hover:bg-surface-container-low transition-all text-title-md"
                >
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  <span>Yeni Demo Tedarikçi Oluştur</span>
                </Link>
              </div>
            </div>

            {/* Visual Hero Mosaic */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xl border border-outline-variant/40 flex flex-col gap-4">
                <div className="flex items-center justify-between p-2.5 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-tertiary-container" />
                    <span className="text-title-md text-primary font-bold">
                      Sandal Bedesteni Kasası #01
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-data-mono text-label-sm font-bold">
                    AKTİF NAKİL
                  </span>
                </div>

                <div className="relative h-60 rounded-lg overflow-hidden">
                  <img
                    src={resolveAssetUrl('images/hero_vault.jpg')}
                    alt="GIA Sertifikalı Emanet Lot"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-on-primary">
                    <div>
                      <div className="text-label-sm tracking-widest uppercase text-surface-dim">
                        Emanet Lot #TR-8491
                      </div>
                      <div className="text-title-md font-semibold">4.82 ct D-Flawless Type IIa</div>
                    </div>
                    <div className="text-right">
                      <div className="text-label-sm text-surface-dim">Kasa Durumu</div>
                      <div className="font-data-mono text-data-mono text-tertiary-fixed font-bold">
                        Ekspertiz Onaylı
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary">
                      <Watch className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-title-md text-primary font-bold">
                        Rolex Daytona 126500LN
                      </div>
                      <div className="font-data-mono text-label-sm text-on-surface-variant">
                        Seri No: 88M***** (Maskeli)
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-label-sm text-secondary uppercase font-bold">
                    <CheckCircle2 className="w-4 h-4" /> 42 Nokta OK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4-Tier Security Protocol */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-1">
              <span className="font-data-mono text-label-sm text-secondary tracking-widest uppercase font-bold">
                GÜVEN VE TASFİYE PROTOKOLÜ
              </span>
              <h2 className="text-headline-lg text-primary">
                Neden Kapalı Devre? 4 Kademeli Güvenlik Protokolü
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: '01',
                tag: '1. Filtre',
                title: 'Yalnızca Davet & Kurumsal Referans',
                desc: 'Mevcut en az 2 aktif borsa üyesinin kurumsal kefalet referansı olmadan hiçbir firma üyelik sürecine dahil edilemez.',
                foot: '2 Kurumsal Sponsor Şartı',
              },
              {
                num: '02',
                tag: '2. Filtre',
                title: 'Resmi Oda & Sicil Doğrulaması',
                desc: 'İstanbul Kuyumcular Odası (İKO) veya İTO Mücevherat Komitesi sicil kayıtları, atölye ruhsatı ve vergi levhası fiziksel olarak denetlenir.',
                foot: 'Oda Sicil & Adres Kontrolü',
              },
              {
                num: '03',
                tag: '3. Filtre',
                title: 'Çift Taraflı Bağımsız Ekspertiz',
                desc: 'Taşlar uzman gemologlar, saatler ise 42 noktalı usta saatçi onayından geçmeden takas işlemine izin verilmez.',
                foot: 'Gemoloji & Horoloji Heyeti',
              },
              {
                num: '04',
                tag: 'Nihai Takas',
                title: 'Emanet Kasa & Zırhlı Lojistik',
                desc: 'Ödeme banka emanetinde bloke edilir. Alıcı Sandal Bedesteni kasasında ürünü fiziksel teyit edip onaylamadan ödeme serbest bırakılmaz.',
                foot: 'Brinks & Loomis Güvencesi',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/40 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-data-mono font-bold">
                      {step.num}
                    </span>
                    <span className="text-label-sm text-secondary font-semibold uppercase">
                      {step.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-headline-sm text-primary mb-1.5">{step.title}</h3>
                    <p className="text-body-md text-on-surface-variant">{step.desc}</p>
                  </div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded font-data-mono text-label-sm text-primary font-semibold">
                  {step.foot}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Portfolio Categories */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 p-6 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/40 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Diamond className="w-6 h-6 text-primary" />
                    <span className="text-headline-sm text-primary">
                      Doğal &amp; Laboratuvar Pırlanta Borsası
                    </span>
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant">
                  Uluslararası sertifikalı (GIA, HRD, IGI) veya sertifikasız taşlarda net teklif verme. Laboratuvar üretimi ve doğal taşlar ayrı panellerde filtrelenir.
                </p>
              </div>
              <Link
                to="/pirlantalar"
                className="inline-flex items-center gap-1.5 text-label-md text-primary font-bold hover:underline"
              >
                <span>Canlı Pırlanta Borsasına Git</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-5 p-6 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/40 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Watch className="w-6 h-6 text-primary" />
                    <span className="text-headline-sm text-primary">Kurumsal Saat Borsası</span>
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant">
                  Rolex, Patek Philippe ve Audemars Piguet referansları. İlanlarda seri numaraları borsa güvencesiyle maskelenir.
                </p>
              </div>
              <Link
                to="/saatler"
                className="inline-flex items-center gap-1.5 text-label-md text-primary font-bold hover:underline"
              >
                <span>Saat Kataloğuna Git</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Testimonials */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto space-y-6">
          <h2 className="text-headline-lg text-primary">Üye Atölye ve Tüccarlar Ne Diyor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-secondary">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-data-mono text-label-sm text-on-surface-variant">
                  Borsa Üyesi #TR-042
                </span>
              </div>
              <p className="text-body-lg text-primary italic leading-relaxed">
                &ldquo;Atelier B2B&apos;de yalnızca ticaret sicili doğrulanmış meslektaşlarımızla güvenle taş takası yapabiliyoruz.&rdquo;
              </p>
              <div className="text-title-md font-bold text-primary">
                Bosphorus Gems &amp; Diamond Ltd. — Kapalıçarşı
              </div>
            </div>

            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-secondary">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-data-mono text-label-sm text-on-surface-variant">
                  Borsa Üyesi #TR-118
                </span>
              </div>
              <p className="text-body-lg text-primary italic leading-relaxed">
                &ldquo;Saat seri numaralarının platformda maskelenmesi ve Sandal Bedesteni kasasında 42 noktalı fiziki kontrol imkanı sektöre aradığı kurumsal güvenceyi getirdi.&rdquo;
              </p>
              <div className="text-title-md font-bold text-primary">
                Anatolia Horology &amp; Jewels A.Ş. — Nişantaşı
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Interactive Invite Verification Terminal + Demo Vendor Selector */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface" id="davet-giris">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="p-6 lg:p-10 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 text-label-md text-secondary tracking-widest uppercase font-bold">
                <KeyRound className="w-4 h-4" />
                <span>KAPALI DEVRE KATILIM PROTOKOLÜ</span>
              </div>
              <h2 className="text-headline-lg text-primary">
                Atölyenizi veya Envanterinizi Borsa Ağına Dahil Edin
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Atelier B2B bünyesinde işlem yapabilmek için 8 haneli kurumsal davet kodunu doğrulayın, yeni demo tedarikçi başvurusu oluşturun veya aşağıdaki hazır demo tedarikçi hesaplarından birini seçin.
              </p>
            </div>

            <div className="lg:col-span-6 bg-surface-container-low p-6 rounded-xl space-y-4 border border-outline-variant/40">
              <div className="flex items-center rounded bg-surface-container p-1 text-title-md">
                <button
                  type="button"
                  onClick={() => setTerminalTab('code')}
                  className={cn(
                    'flex-1 py-2 text-center rounded transition-all text-body-sm font-semibold',
                    terminalTab === 'code'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  )}
                >
                  Davet Kodu İle Giriş
                </button>
                <button
                  type="button"
                  onClick={() => setTerminalTab('referral')}
                  className={cn(
                    'flex-1 py-2 text-center rounded transition-all text-body-sm font-semibold',
                    terminalTab === 'referral'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  )}
                >
                  Yeni Tedarikçi Başvurusu
                </button>
              </div>

              {terminalNotice && (
                <div className="p-3 rounded-lg bg-tertiary-fixed/50 text-on-tertiary-fixed-variant text-body-sm font-semibold">
                  {terminalNotice}
                </div>
              )}

              {terminalTab === 'code' ? (
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-body-sm font-semibold text-primary mb-1">
                      8 Haneli Kurumsal Davet Kodu
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded bg-surface-container-lowest text-primary font-data-mono text-headline-sm uppercase tracking-widest outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-semibold text-primary mb-1">
                      Kurumsal VKN / Vergi Kimlik No
                    </label>
                    <input
                      type="text"
                      value={vkn}
                      onChange={(e) => setVkn(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded bg-surface-container-lowest text-primary font-data-mono text-body-md outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded bg-primary text-on-primary text-title-md font-bold shadow-md hover:bg-primary-container transition-all"
                  >
                    Kodu Doğrula ve Portala Giriş Yap
                  </button>
                </form>
              ) : (
                <form onSubmit={handleReferralSubmit} className="space-y-4">
                  <p className="text-body-sm text-on-surface-variant">
                    Kendi demo tedarikçi firmanızı oluşturup hemen pırlanta ve saat ilanı yayınlayabilirsiniz.
                  </p>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded bg-secondary text-on-secondary text-title-md font-bold shadow-sm hover:opacity-90 transition-all"
                  >
                    Yeni Tedarikçi Oluşturma Formuna Git
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-headline-sm text-primary">
              Hazır Demo Tedarikçi Hesapları (Tek Tıkla Geçiş)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {vendors.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleSelectDemoVendor(v.id)}
                  className="text-left bg-surface-container-lowest border border-outline-variant/50 hover:border-primary rounded-xl p-4 space-y-2 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-body-md">
                    <Building2 className="w-4 h-4 text-secondary shrink-0" />
                    <span className="truncate">{v.companyName}</span>
                  </div>
                  <div className="text-label-sm text-outline">
                    {v.city} · {v.specialty}
                  </div>
                  <span className="inline-flex items-center gap-1 text-label-sm text-primary font-semibold pt-1">
                    Bu Hesapla Panele Gir <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

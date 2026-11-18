import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Verified,
  Diamond,
  Sparkles,
  Watch,
  PlusCircle,
  ShieldCheck,
  SlidersHorizontal,
  Handshake,
  Check,
  Info,
  Lock,
  KeyRound,
  Star,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { listingRepository, vendorRepository } from '@/repositories';
import {
  cn,
  EUR_TRY_RATE,
  EUR_USD_RATE,
  formatCurrency,
  GOLD_GRAM_TRY,
  resolveAssetUrl,
  USD_TRY_RATE,
} from '@/lib/utils';
import { DIAMOND_SHAPES, DiamondShapeIcon } from '@/components/common/DiamondShapeIcon';
import { DiamondCard } from '@/components/marketplace/DiamondCard';
import { WatchCard } from '@/components/marketplace/WatchCard';
import { useMarketplace } from '@/context/MarketplaceContext';

const SHAPE_MARKET_COUNTS: Record<string, string> = {
  Round: '18.420',
  Oval: '6.910',
  Cushion: '4.180',
  Emerald: '3.540',
  Radiant: '2.920',
  Pear: '3.110',
  Princess: '2.680',
  Marquise: '1.490',
  Asscher: '980',
  Heart: '840',
};

const WATCH_BRAND_CARDS = [
  { name: 'Rolex', count: '1.412 İlan' },
  { name: 'Audemars Piguet', count: '540 İlan' },
  { name: 'Patek Philippe', count: '320 İlan' },
  { name: 'Vacheron Constantin', count: '190 İlan' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { currency, setActiveVendorId } = useMarketplace();
  const [terminalTab, setTerminalTab] = useState<'code' | 'referral'>('code');
  const [inviteCode, setInviteCode] = useState('ATL-8942-TK');
  const [vkn, setVkn] = useState('1840291842');

  const { data: diamonds = [] } = useQuery({
    queryKey: ['diamonds', 'home'],
    queryFn: () => listingRepository.getDiamonds({ sortBy: 'newest' }),
  });

  const { data: watches = [] } = useQuery({
    queryKey: ['watches', 'home'],
    queryFn: () => listingRepository.getWatches({ sortBy: 'newest' }),
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => vendorRepository.getAll(),
  });

  const naturalCount = diamonds.filter((d) => d.origin === 'natural').length;
  const labCount = diamonds.filter((d) => d.origin === 'lab').length;

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/panel');
  };

  const handleSelectDemoVendor = (id: string) => {
    setActiveVendorId(id);
    navigate('/panel');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Günlük Döviz ve Altın Kurları Ticker Şeridi */}
      <section className="w-full bg-primary text-on-primary py-2 px-4 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3 text-label-sm">
          <div className="flex items-center gap-5 overflow-x-auto no-scrollbar whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" />
              <span className="uppercase tracking-wider text-surface-container font-semibold">
                GÜNLÜK PİYASA KURLARI:
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-data-mono tabular-nums">
              <span className="text-surface-dim">USD/TRY</span>
              <strong className="text-white">{USD_TRY_RATE.toFixed(2)} ₺</strong>
              <span className="text-tertiary-fixed">+0.12%</span>
            </div>
            <div className="w-px h-3 bg-primary-container" />
            <div className="flex items-center gap-1.5 font-data-mono tabular-nums">
              <span className="text-surface-dim">EUR/TRY</span>
              <strong className="text-white">{EUR_TRY_RATE.toFixed(2)} ₺</strong>
              <span className="text-tertiary-fixed">+0.18%</span>
            </div>
            <div className="w-px h-3 bg-primary-container" />
            <div className="flex items-center gap-1.5 font-data-mono tabular-nums">
              <span className="text-surface-dim">HAS ALTIN (Gr)</span>
              <strong className="text-secondary-fixed">
                {GOLD_GRAM_TRY.toLocaleString('tr-TR')} ₺
              </strong>
              <span className="text-tertiary-fixed">+0.45%</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 font-data-mono tabular-nums">
              <span className="text-surface-dim">EUR/USD</span>
              <strong className="text-white">{EUR_USD_RATE.toFixed(3)}</strong>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-surface-container font-data-mono tabular-nums">
            <span className="flex items-center gap-1">
              <Verified className="w-3.5 h-3.5 text-secondary-fixed" />
              <span>Kapalıçarşı &amp; Kuyumcukent Kasa Ağı</span>
            </span>
          </div>
        </div>
      </section>

      {/* LANDING PAGE HERO SECTION */}
      <section className="w-full px-4 lg:px-8 py-10 lg:py-16 bg-surface relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-surface-container-high/40 blur-3xl pointer-events-none" />
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Landing Page Editorial Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start lg:pr-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high text-primary mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
              <span className="text-label-sm uppercase tracking-widest font-bold">
                KAPALI DEVRE B2B MÜCEVHERAT &amp; SAAT BORSASI
              </span>
            </div>

            <h1 className="text-headline-lg-mobile sm:text-display-lg text-primary tracking-tight mb-4">
              Güven, Referans ve Bağımsız Denetimle Güçlendirilmiş{' '}
              <span className="text-surface-tint">Pırlanta &amp; Saat Borsası.</span>
            </h1>

            <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6 max-w-2xl">
              Atelier B2B; akredite kuyumcu atölyeleri, üreticiler ve saat tüccarlarının fiziki emanet kasaları üzerinden doğrudan işlem yaptığı kurumsal tedarik ve borsa platformudur.
            </p>

            {/* Metric Stats Row */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 bg-surface-container-lowest rounded-xl shadow-sm px-4 mb-6 border border-outline-variant/40">
              <div>
                <div className="text-headline-sm text-primary tracking-tight font-bold tabular-nums">
                  45.000+
                </div>
                <div className="text-label-sm text-outline uppercase tracking-wider">
                  Pırlanta &amp; Saat
                </div>
              </div>
              <div className="pl-3 border-l border-outline-variant/40">
                <div className="text-headline-sm text-primary tracking-tight font-bold tabular-nums">
                  280+ ({vendors.length})
                </div>
                <div className="text-label-sm text-outline uppercase tracking-wider">
                  Akredite Atölye
                </div>
              </div>
              <div className="pl-3 sm:border-l border-outline-variant/40">
                <div className="text-headline-sm text-primary tracking-tight font-bold">
                  0.00%
                </div>
                <div className="text-label-sm text-outline uppercase tracking-wider">
                  Uyuşmazlık Oranı
                </div>
              </div>
              <div className="pl-3 border-l border-outline-variant/40">
                <div className="text-headline-sm text-primary tracking-tight font-bold">
                  2 Merkez
                </div>
                <div className="text-label-sm text-outline uppercase tracking-wider">
                  Emanet Kasası
                </div>
              </div>
            </div>

            {/* CTA Action Cluster */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                to="/pirlantalar"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-container text-on-primary text-title-md hover:bg-primary transition-all duration-200 shadow-md"
              >
                <span>Pırlantaları Keşfet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/saatler"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-primary text-title-md hover:bg-surface-container-low transition-colors"
              >
                <Watch className="w-4 h-4 text-secondary" />
                <span>Saatler</span>
              </Link>
              <Link
                to="/panel/ilan-ekle"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-surface-container-high text-primary text-title-md hover:bg-surface-container-highest transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>İlan Ekle</span>
              </Link>
              <a
                href="#davet-giris"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-secondary text-secondary text-title-md hover:bg-secondary-container/30 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>Davet Kodu ile Giriş</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Hero Mosaic Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xl border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-tertiary-container" />
                  <span className="text-title-md text-primary font-bold">
                    Sandal Bedesteni Kasası #01
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-data-mono text-label-sm font-bold">
                  AKTİF KASA
                </span>
              </div>

              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-container group">
                <img
                  src={resolveAssetUrl('images/hero_diamond.jpg')}
                  alt="Atelier B2B Tektaş Pırlanta"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-primary text-label-md shadow-sm">
                    <Verified className="w-3.5 h-3.5 text-tertiary-container" /> GIA 248910482
                  </span>
                </div>

                <Link
                  to="/pirlanta/dia-20194"
                  className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-lg shadow-lg flex items-center justify-between hover:bg-white transition-colors"
                >
                  <div>
                    <span className="text-label-sm uppercase tracking-wider text-outline block">
                      Öne Çıkan Seçki
                    </span>
                    <span className="text-title-md text-primary font-bold">
                      2.01 ct D IF · Round Brilliant
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-data-mono text-data-mono text-tertiary-container font-semibold">
                        Kapalıçarşı Ana Kasa
                      </span>
                      <span className="text-outline text-xs">•</span>
                      <span className="font-data-mono text-data-mono text-on-surface-variant">
                        Triple Excellent (3EX)
                      </span>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <span className="text-headline-sm text-primary font-bold block">
                      {formatCurrency(34200, currency)}
                    </span>
                    <span className="text-label-sm text-outline">
                      {formatCurrency(17015, currency)} / ct
                    </span>
                  </div>
                </Link>
              </div>

              <Link
                to="/saat/wat-pepsi-126710"
                className="p-3 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary">
                    <Watch className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-title-md text-primary font-bold">
                      Rolex GMT-Master II &quot;Pepsi&quot;
                    </div>
                    <div className="font-data-mono text-label-sm text-on-surface-variant">
                      Ref. 126710BLRO • Seri No Maskeli
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-label-sm text-secondary uppercase font-bold">
                  <CheckCircle2 className="w-4 h-4" /> 42 Nokta OK
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LANDING SECTION: 4 KADEMELİ GÜVENLİK PROTOKOLÜ */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface-container-low">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-1">
              <span className="font-data-mono text-label-sm text-secondary tracking-widest uppercase font-bold">
                GÜVEN VE TASFİYE PROTOKOLÜ
              </span>
              <h2 className="text-headline-lg text-primary">
                Neden Kapalı Devre? 4 Kademeli Güvenlik Protokolü
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Açık pazarlardaki belirsizlikleri ortadan kaldıran, yalnızca doğrulanmış kuyumcu ve saat tüccarlarına özel kurumsal takas mimarisi.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest shadow-sm text-primary text-title-md border border-outline-variant/40">
              <ShieldCheck className="w-5 h-5 text-tertiary-container" />
              <span>Sıfır Hata Protokolü v4.2</span>
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
                desc: 'Ödeme emanette bloke edilir. Alıcı Sandal Bedesteni veya Kuyumcukent kasasında ürünü teyit etmeden ödeme serbest bırakılmaz.',
                foot: 'Brinks & Loomis Güvencesi',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/40 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-data-mono font-bold">
                      {step.num}
                    </span>
                    <span className="text-label-sm text-secondary font-semibold uppercase">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="text-headline-sm text-primary">{step.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{step.desc}</p>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded font-data-mono text-label-sm text-primary font-semibold">
                  {step.foot}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION A: PIRLANTA TÜRÜ VE MENŞEİ */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
            <div>
              <span className="text-label-md uppercase tracking-wider text-secondary font-bold block mb-1">
                Kategori Seçimi
              </span>
              <h2 className="text-headline-lg text-primary tracking-tight">
                Pırlanta Türü ve Menşei
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-md mt-2 md:mt-0">
              Sertifikalı veya sertifikasız doğal ve laboratuvar üretimi taş portföyü.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tile 1: Doğal Pırlantalar */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group border border-outline-variant/40">
              <div className="absolute top-0 right-0 w-48 h-48 bg-surface-container rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-4">
                  <Diamond className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-primary text-label-sm uppercase font-semibold mb-1.5">
                  Miras &amp; Rezerv
                </div>
                <h3 className="text-headline-md text-primary tracking-tight mb-2">
                  Doğal Pırlantalar
                </h3>
                <p className="text-body-md text-on-surface-variant mb-6 max-w-md">
                  Doğanın milyonlarca yıllık mirası; GIA, HRD, IGI sertifikalı veya atölye ekspertizli doğal taşlar.
                </p>
                <div className="flex items-center gap-6 mb-6 tabular-nums">
                  <div>
                    <span className="text-label-sm text-outline block">Mevcut İlan</span>
                    <span className="text-title-md text-primary font-bold">
                      32.410 Taş ({naturalCount} Demo)
                    </span>
                  </div>
                  <div className="w-px h-8 bg-surface-container" />
                  <div>
                    <span className="text-label-sm text-outline block">Teslimat</span>
                    <span className="text-title-md text-tertiary-container font-bold">
                      Kapalıçarşı Kasa
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative z-10">
                <Link
                  to="/pirlantalar?origin=natural"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary-container transition-colors"
                >
                  <span>Doğal Envanteri Gör</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Tile 2: Laboratuvar Pırlantaları */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group border border-outline-variant/40">
              <div className="absolute top-0 right-0 w-48 h-48 bg-surface-container-high rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-label-sm uppercase font-semibold mb-1.5">
                  Yeni Nesil &amp; İleri Teknoloji
                </div>
                <h3 className="text-headline-md text-primary tracking-tight mb-2">
                  Laboratuvar Pırlantaları
                </h3>
                <p className="text-body-md text-on-surface-variant mb-6 max-w-md">
                  Modern teknoloji ve üstün optik saflık; CVD &amp; HPHT üretim mücevher üreticileri için optimize maliyet avantajı.
                </p>
                <div className="flex items-center gap-6 mb-6 tabular-nums">
                  <div>
                    <span className="text-label-sm text-outline block">Mevcut İlan</span>
                    <span className="text-title-md text-primary font-bold">
                      12.850 Taş ({labCount} Demo)
                    </span>
                  </div>
                  <div className="w-px h-8 bg-surface-container" />
                  <div>
                    <span className="text-label-sm text-outline block">Karat Başı Fiyat</span>
                    <span className="text-title-md text-primary font-bold">
                      $380&apos;dan Başlayan
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative z-10">
                <Link
                  to="/pirlantalar?origin=lab"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high text-primary text-label-md hover:bg-surface-container-highest transition-colors"
                >
                  <span>Lab Envanterini Gör</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: PIRLANTA KESİMİNE GÖRE ARAYIN */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface-container-low">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <span className="text-label-md uppercase tracking-wider text-secondary font-bold block mb-1">
                Geometrik Filtreleme
              </span>
              <h2 className="text-headline-lg text-primary tracking-tight">
                Pırlanta Kesimine Göre Arayın
              </h2>
            </div>
            <Link
              to="/pirlantalar"
              className="inline-flex items-center gap-1 text-label-md text-primary hover:text-primary-container font-semibold mt-2 sm:mt-0"
            >
              <span>Tüm Pırlanta Listesi</span>
              <Info className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
            {DIAMOND_SHAPES.map((item) => (
              <Link
                key={item.value}
                to={`/pirlantalar?shape=${item.value}`}
                className="flex flex-col items-center p-4 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-low border border-outline-variant/40 transition-all duration-200 group text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-2">
                  <DiamondShapeIcon shape={item.value} className="w-9 h-9" />
                </div>
                <span className="text-body-md text-primary font-semibold block leading-tight">
                  {item.value}
                </span>
                <span className="text-label-sm text-outline mt-0.5">{item.label}</span>
                <span className="font-data-mono text-label-sm text-secondary mt-2 font-bold bg-secondary/10 px-1.5 py-0.5 rounded tabular-nums">
                  {SHAPE_MARKET_COUNTS[item.value] || '1.200'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION C: SON EKLENEN PIRLANTALAR */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface" id="katalog">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm uppercase font-semibold mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Canlı B2B Borsa Akışı
              </div>
              <h2 className="text-headline-lg text-primary tracking-tight">
                Son Eklenen Pırlantalar
              </h2>
            </div>
            <Link
              to="/pirlantalar"
              className="inline-flex items-center gap-1.5 text-title-md text-primary hover:text-primary-container font-semibold mt-2 sm:mt-0 group"
            >
              <span>Tümünü Gör ({diamonds.length} Taş)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {diamonds.slice(0, 4).map((d) => (
              <DiamondCard key={d.id} diamond={d} />
            ))}
          </div>
        </div>
      </section>

      {/* SAATLER VİTRİNİ & ÖNE ÇIKAN SAAT MARKALARI */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface-container-low">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-label-md uppercase tracking-wider text-secondary font-bold block mb-1">
                Horoloji Portföyü
              </span>
              <h2 className="text-headline-lg text-primary tracking-tight">
                Saatler &amp; Öne Çıkan Markalar
              </h2>
            </div>
            <Link
              to="/saatler"
              className="inline-flex items-center gap-1.5 text-title-md text-primary hover:text-primary-container font-semibold"
            >
              <span>Tüm Saat Kataloğu ({watches.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {WATCH_BRAND_CARDS.map((b) => (
              <Link
                key={b.name}
                to={`/saatler?brand=${encodeURIComponent(b.name)}`}
                className="p-4 bg-surface-container-lowest border border-outline-variant/40 hover:border-primary rounded-xl shadow-sm flex items-center justify-between transition-all"
              >
                <div className="flex flex-col">
                  <span className="text-title-md font-bold text-primary tracking-tight">
                    {b.name}
                  </span>
                  <span className="text-label-sm text-on-surface-variant">{b.count}</span>
                </div>
                <Watch className="w-5 h-5 text-secondary" />
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {watches.slice(0, 3).map((w) => (
              <WatchCard key={w.id} watch={w} />
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM STANDARTLARI & ÜYE YORUMLARI */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface">
        <div className="max-w-[1400px] mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-4">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-title-md text-primary font-bold mb-1.5">
                Detaylı ve Hassas Filtreleme
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                4C parametreleri, derinlik ve tabla oranları, cila, simetri ve florasanlık bazında anlık envanter taraması yapın.
              </p>
              <div className="mt-4 pt-2 flex items-center gap-1 text-primary text-label-sm uppercase font-semibold">
                <span>Milimetrik Karat Seçimi</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-title-md text-primary font-bold mb-1.5">
                Sertifikalı &amp; Ekspertizli Stok
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                GIA, IGI ve HRD laboratuvar sertifikalı taşların yanı sıra atölye onaylı sertifikasız taş ve saat ilanlarını güvenle inceleyin.
              </p>
              <div className="mt-4 pt-2 flex items-center gap-1 text-primary text-label-sm uppercase font-semibold">
                <span>Ekspertiz Doğrulama Desteği</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-4">
                <Handshake className="w-6 h-6" />
              </div>
              <h3 className="text-title-md text-primary font-bold mb-1.5">
                Doğrudan Tedarikçi İletişimi
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Aracısız, komisyonsuz teklif yönetimi. Kapalıçarşı ve Kuyumcukent kasasından doğrudan yerinde teslimat veya sigortalı transfer.
              </p>
              <div className="mt-4 pt-2 flex items-center gap-1 text-primary text-label-sm uppercase font-semibold">
                <span>Sıfır Komisyon Politikası</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/40 space-y-3">
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
                &ldquo;Atelier B2B&apos;de yalnızca ticaret sicili doğrulanmış meslektaşlarımızla güvenle taş ve saat takası yapabiliyoruz. Kapalıçarşı kasasındaki anlık teslimat bize hız kazandırdı.&rdquo;
              </p>
              <div className="text-title-md font-bold text-primary">
                Bosphorus Gems &amp; Diamond Ltd. — Kapalıçarşı
              </div>
            </div>

            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/40 space-y-3">
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

      {/* DAVET KODU & DEMO TEDARİKÇİ GİRİŞ TERMİNALİ */}
      <section className="w-full px-4 lg:px-8 py-12 bg-surface-container-low" id="davet-giris">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="p-6 lg:p-10 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-label-md text-secondary tracking-widest uppercase font-bold">
                <KeyRound className="w-4 h-4" />
                <span>KAPALI DEVRE KATILIM PROTOKOLÜ</span>
              </div>
              <h2 className="text-headline-lg text-primary">
                Atölyenizi veya Envanterinizi Borsa Ağına Dahil Edin
              </h2>
              <p className="text-body-md text-on-surface-variant">
                8 haneli kurumsal davet kodunuzla giriş yapın, yeni demo tedarikçi oluşturun veya hazır demo tedarikçi hesaplarından birini seçerek hemen ilan ekleyin.
              </p>
              <div className="space-y-2 text-body-md text-primary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tertiary-container shrink-0" />
                  <span>İKO veya İTO Mücevher / Kuyumculuk Sicil Kaydı</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tertiary-container shrink-0" />
                  <span>Sertifikalı ve sertifikasız pırlanta &amp; saat listeleme desteği</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-surface-container-low p-6 rounded-xl space-y-4 border border-outline-variant/40">
              <div className="flex items-center rounded bg-surface-container p-1">
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
                  Yeni Tedarikçi Oluştur
                </button>
              </div>

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
                <div className="space-y-4">
                  <p className="text-body-sm text-on-surface-variant">
                    Kendi demo tedarikçi firmanızı oluşturup hemen pırlanta ve saat ilanı yayınlayabilirsiniz.
                  </p>
                  <Link
                    to="/panel/tedarikci-olustur"
                    className="w-full py-3.5 rounded bg-secondary text-on-secondary text-title-md font-bold shadow-sm hover:opacity-90 transition-all flex items-center justify-center"
                  >
                    Yeni Tedarikçi Oluşturma Formuna Git
                  </Link>
                </div>
              )}
            </div>
          </div>

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
      </section>
    </div>
  );
}

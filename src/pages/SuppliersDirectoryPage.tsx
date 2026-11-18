import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, MapPin, CheckCircle2, Star, ArrowRight, Search } from 'lucide-react';
import { listingRepository, vendorRepository } from '@/repositories';

export function SuppliersDirectoryPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState<string>('Tümü');

  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => vendorRepository.getAll(),
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['listings', 'available'],
    queryFn: () => listingRepository.getAll(false),
  });

  const filtered = vendors.filter((v) => {
    const matchesSearch =
      !search.trim() ||
      v.companyName.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = specialty === 'Tümü' || v.specialty === specialty;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg-mobile sm:text-headline-lg text-primary">
            Doğrulanmış B2B Tedarikçi Dizini
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            İstanbul Kapalıçarşı, Kuyumcukent, Nişantaşı ve İzmir merkezli onaylı atölyeler.
          </p>
        </div>

        <Link
          to="/tedarikci-ol"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md self-start"
        >
          Tedarikçi Olarak Katıl
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-outline mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma adı veya şehir ara..."
            className="w-full bg-transparent text-body-sm focus:outline-none"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-sm text-primary"
        >
          <option value="Tümü">Tüm Uzmanlıklar</option>
          <option value="Pırlanta">Pırlanta</option>
          <option value="Saat">Saat</option>
          <option value="Pırlanta & Saat">Pırlanta &amp; Saat</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((vendor) => {
          const activeCount = listings.filter((l) => l.vendorId === vendor.id).length;
          return (
            <div
              key={vendor.id}
              className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex flex-col justify-between gap-4 hover:border-secondary transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-secondary-fixed" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-title-md font-bold text-primary">
                          {vendor.companyName}
                        </h2>
                        {vendor.verified && (
                          <CheckCircle2 className="w-4 h-4 text-tertiary-container shrink-0" />
                        )}
                      </div>
                      <p className="text-label-sm text-outline flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-secondary" />
                        {vendor.city} · {vendor.district}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-semibold">
                    {vendor.specialty}
                  </span>
                </div>

                <p className="text-body-sm text-on-surface-variant line-clamp-2">{vendor.about}</p>
              </div>

              <div className="pt-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-label-sm text-on-surface-variant tabular-nums">
                  <span className="inline-flex items-center gap-1 text-primary font-semibold">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    {vendor.rating.toFixed(1)}
                  </span>
                  <span>{vendor.completedTrades} B2B İşlem</span>
                  <span className="text-tertiary-container font-semibold">
                    {activeCount} Aktif İlan
                  </span>
                </div>

                <Link
                  to={`/tedarikci/${vendor.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-low text-primary text-label-md hover:bg-primary-container hover:text-on-primary transition-colors"
                >
                  <span>Profili &amp; Stokları Gör</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

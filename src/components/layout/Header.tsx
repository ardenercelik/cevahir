import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Diamond,
  Search,
  Plus,
  Store,
  Menu,
  X,
  Heart,
  Scale,
  Watch,
  Users,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { cn } from '@/lib/utils';

export function Header() {
  const { currency, setCurrency, favorites, compareIds } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (
      q.toLowerCase().startsWith('w-') ||
      q.toLowerCase().includes('rolex') ||
      q.toLowerCase().includes('patek')
    ) {
      navigate(`/saatler?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/pirlantalar?q=${encodeURIComponent(q)}`);
    }
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'px-3.5 py-2 rounded-lg text-body-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap',
      isActive
        ? 'text-primary-container font-semibold bg-surface-container-low'
        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/40 shadow-[0_1px_8px_rgba(23,36,58,0.06)]">
      <div className="h-20 max-w-[1440px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <Diamond className="w-5 h-5 text-secondary-fixed" />
          </div>
          <div className="flex flex-col">
            <span className="text-title-md tracking-tight text-primary leading-none font-bold">
              ATELIER
            </span>
            <span className="text-[10px] tracking-widest uppercase text-outline font-semibold mt-0.5">
              B2B BORSA
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-2">
          <NavLink to="/pirlantalar" className={navLinkClass}>
            Pırlantalar
          </NavLink>
          <NavLink to="/saatler" className={navLinkClass}>
            Saatler
          </NavLink>
          <NavLink to="/tedarikciler" className={navLinkClass}>
            Tedarikçiler
          </NavLink>
          <NavLink to="/favoriler" className={navLinkClass}>
            <span>Favoriler</span>
            <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm">
              {favorites.length}
            </span>
          </NavLink>
          <NavLink to="/karsilastir" className={navLinkClass}>
            <span>Karşılaştır</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface text-label-sm">
              {compareIds.length}
            </span>
          </NavLink>
        </nav>

        {/* Right Controls (Generous spacing between search, currency, Vendor Paneli & İlan Ekle) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-1.5"
          >
            <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Taş No, Sertifika, Ref..."
              className="bg-transparent text-body-sm text-on-surface placeholder:text-outline focus:outline-none w-36 lg:w-44"
            />
          </form>

          {/* Currency Switcher */}
          <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/40">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={cn(
                'px-2 py-1 rounded text-label-sm font-semibold transition-all',
                currency === 'USD'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('TRY')}
              className={cn(
                'px-2 py-1 rounded text-label-sm font-semibold transition-all',
                currency === 'TRY'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              TRY (₺)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-outline-variant/40">
            <Link
              to="/panel"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low text-primary hover:bg-surface-container-high text-label-md font-semibold transition-colors whitespace-nowrap"
            >
              <Store className="w-4 h-4 text-secondary" />
              <span>Vendor Paneli</span>
            </Link>

            <Link
              to="/panel/ilan-ekle"
              className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary text-label-md px-4 py-2 rounded-lg hover:bg-primary transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>İlan Ekle</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="xl:hidden p-2 rounded-lg bg-surface-container-low text-primary"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-outline-variant/40 px-4 py-4 space-y-3 shadow-lg">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2"
          >
            <Search className="w-4 h-4 text-outline mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Taş No, Sertifika No, Saat Ref..."
              className="bg-transparent text-body-sm text-on-surface placeholder:text-outline focus:outline-none w-full"
            />
          </form>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/pirlantalar"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-primary text-body-sm font-semibold"
            >
              <Diamond className="w-4 h-4 text-secondary" />
              Pırlantalar
            </Link>
            <Link
              to="/saatler"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-primary text-body-sm font-semibold"
            >
              <Watch className="w-4 h-4 text-secondary" />
              Saatler
            </Link>
            <Link
              to="/tedarikciler"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-primary text-body-sm font-semibold"
            >
              <Users className="w-4 h-4 text-secondary" />
              Tedarikçiler
            </Link>
            <Link
              to="/favoriler"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-primary text-body-sm font-semibold"
            >
              <Heart className="w-4 h-4 text-secondary" />
              Favoriler ({favorites.length})
            </Link>
            <Link
              to="/karsilastir"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-primary text-body-sm font-semibold"
            >
              <Scale className="w-4 h-4 text-secondary" />
              Karşılaştır ({compareIds.length})
            </Link>
            <Link
              to="/panel"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-primary text-body-sm font-semibold"
            >
              <Store className="w-4 h-4 text-secondary" />
              Vendor Paneli
            </Link>
          </div>

          <div className="flex gap-2 pt-1">
            <Link
              to="/panel/ilan-ekle"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary-container text-on-primary text-label-md"
            >
              <Plus className="w-4 h-4" />
              Yeni İlan Ekle
            </Link>
            <Link
              to="/tedarikci-ol"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-outline-variant text-primary text-label-md"
            >
              Tedarikçi Ol
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

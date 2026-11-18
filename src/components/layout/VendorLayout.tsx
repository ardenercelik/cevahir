import { Link, NavLink, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquare,
  Settings,
  UserPlus,
  ExternalLink,
  Store,
  ChevronDown,
} from 'lucide-react';
import { vendorRepository } from '@/repositories';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { cn } from '@/lib/utils';

export function VendorLayout() {
  const { activeVendorId, setActiveVendorId } = useMarketplace();
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => vendorRepository.getAll(),
  });

  const activeVendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];

  const sideLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-colors',
      isActive
        ? 'bg-primary-container text-on-primary font-semibold'
        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
    );

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />
      <div className="flex-1 pt-28 pb-24 md:pb-12 max-w-[1440px] w-full mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          {/* Active Demo Vendor Selector */}
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-label-sm uppercase tracking-wider text-outline font-semibold">
                Aktif Demo Tedarikçi
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                DEMO
              </span>
            </div>
            <div className="relative">
              <select
                value={activeVendor?.id || activeVendorId}
                onChange={(e) => setActiveVendorId(e.target.value)}
                className="w-full appearance-none bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 pr-8 text-body-sm font-semibold text-primary focus:outline-none focus:border-primary"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.companyName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {activeVendor && (
              <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span className="truncate">
                  {activeVendor.city} · {activeVendor.chamberRegistrationNo}
                </span>
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1 shadow-sm">
            <NavLink to="/panel" end className={sideLinkClass}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Özet Panel</span>
            </NavLink>
            <NavLink to="/panel/envanter" className={sideLinkClass}>
              <Package className="w-4 h-4 shrink-0" />
              <span>Envanter Konsolu</span>
            </NavLink>
            <NavLink to="/panel/ilan-ekle" className={sideLinkClass}>
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Yeni İlan Ekle</span>
            </NavLink>
            <NavLink to="/panel/talepler" className={sideLinkClass}>
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Gelen Talepler</span>
            </NavLink>
            <NavLink to="/panel/ayarlar" className={sideLinkClass}>
              <Settings className="w-4 h-4 shrink-0" />
              <span>Profil Ayarları</span>
            </NavLink>
            <NavLink to="/panel/tedarikci-olustur" className={sideLinkClass}>
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Yeni Tedarikçi Oluştur</span>
            </NavLink>
            <Link
              to="/pirlantalar"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-body-sm font-medium text-tertiary-container hover:bg-surface-container-low transition-colors"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>Pazaryerine Dön</span>
            </Link>
          </nav>
        </aside>

        {/* Main Vendor Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

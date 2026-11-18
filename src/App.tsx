import { HashRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { VendorLayout } from '@/components/layout/VendorLayout';
import { HomePage } from '@/pages/HomePage';
import { DiamondCatalogPage } from '@/pages/DiamondCatalogPage';
import { DiamondDetailPage } from '@/pages/DiamondDetailPage';
import { WatchCatalogPage } from '@/pages/WatchCatalogPage';
import { WatchDetailPage } from '@/pages/WatchDetailPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { CompareDiamondsPage } from '@/pages/CompareDiamondsPage';
import { SuppliersDirectoryPage } from '@/pages/SuppliersDirectoryPage';
import { SupplierProfilePage } from '@/pages/SupplierProfilePage';
import { RequestQuotePage } from '@/pages/RequestQuotePage';
import { BecomeVendorPage } from '@/pages/vendor/BecomeVendorPage';
import { CreateVendorPage } from '@/pages/vendor/CreateVendorPage';
import { VendorDashboardPage } from '@/pages/vendor/VendorDashboardPage';
import { VendorInventoryPage } from '@/pages/vendor/VendorInventoryPage';
import { AddListingCategoryPage } from '@/pages/vendor/AddListingCategoryPage';
import { DiamondListingFormPage } from '@/pages/vendor/DiamondListingFormPage';
import { WatchListingFormPage } from '@/pages/vendor/WatchListingFormPage';
import { EditListingRouterPage } from '@/pages/vendor/EditListingRouterPage';
import { ListingPreviewPage } from '@/pages/vendor/ListingPreviewPage';
import { VendorInquiriesPage } from '@/pages/vendor/VendorInquiriesPage';
import { VendorSettingsPage } from '@/pages/vendor/VendorSettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MarketplaceProvider>
        <HashRouter>
          <Routes>
            {/* Marketplace Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/pirlantalar" element={<DiamondCatalogPage />} />
              <Route path="/pirlantalar/ara" element={<DiamondCatalogPage isSearchMode />} />
              <Route path="/pirlanta/:id" element={<DiamondDetailPage />} />
              <Route path="/saatler" element={<WatchCatalogPage />} />
              <Route path="/saatler/ara" element={<WatchCatalogPage isSearchMode />} />
              <Route path="/saat/:id" element={<WatchDetailPage />} />
              <Route path="/favoriler" element={<FavoritesPage />} />
              <Route path="/karsilastir" element={<CompareDiamondsPage />} />
              <Route path="/tedarikciler" element={<SuppliersDirectoryPage />} />
              <Route path="/tedarikci/:id" element={<SupplierProfilePage />} />
              <Route path="/teklif-iste" element={<RequestQuotePage />} />
              <Route path="/tedarikci-ol" element={<BecomeVendorPage />} />
              <Route path="/kurumsal" element={<BecomeVendorPage />} />
            </Route>

            {/* Vendor Portal Routes */}
            <Route path="/panel" element={<VendorLayout />}>
              <Route index element={<VendorDashboardPage />} />
              <Route path="envanter" element={<VendorInventoryPage />} />
              <Route path="ilan-ekle" element={<AddListingCategoryPage />} />
              <Route path="ilan-ekle/pirlanta" element={<DiamondListingFormPage />} />
              <Route path="ilan-ekle/saat" element={<WatchListingFormPage />} />
              <Route path="ilan-duzenle/:id" element={<EditListingRouterPage />} />
              <Route path="onizleme/:id" element={<ListingPreviewPage />} />
              <Route path="talepler" element={<VendorInquiriesPage />} />
              <Route path="ayarlar" element={<VendorSettingsPage />} />
              <Route path="tedarikci-olustur" element={<CreateVendorPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </MarketplaceProvider>
    </QueryClientProvider>
  );
}

export default App;

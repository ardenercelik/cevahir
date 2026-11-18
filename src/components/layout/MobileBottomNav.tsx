import { NavLink } from 'react-router-dom';
import { Home, Diamond, Watch, Heart, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const itemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 text-[11px] font-medium transition-colors',
      isActive ? 'text-primary font-semibold' : 'text-outline'
    );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/50 grid grid-cols-5 h-16">
      <NavLink to="/" end className={itemClass}>
        <Home className="w-5 h-5" />
        <span>Ana Sayfa</span>
      </NavLink>
      <NavLink to="/pirlantalar" className={itemClass}>
        <Diamond className="w-5 h-5" />
        <span>Pırlanta</span>
      </NavLink>
      <NavLink to="/saatler" className={itemClass}>
        <Watch className="w-5 h-5" />
        <span>Saatler</span>
      </NavLink>
      <NavLink to="/favoriler" className={itemClass}>
        <Heart className="w-5 h-5" />
        <span>Favoriler</span>
      </NavLink>
      <NavLink to="/panel" className={itemClass}>
        <Store className="w-5 h-5" />
        <span>Panel</span>
      </NavLink>
    </nav>
  );
}

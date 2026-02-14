import { ShoppingBag, LogIn } from 'lucide-react';
import logo from '@/assets/logo.png';

const SiteHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <a href="/" className="flex items-center">
          <img src={logo} alt="Radar das Ofertas" className="h-16 sm:h-20 w-auto" />
        </a>
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
            Como Funciona
          </a>
          <a href="#" className="flex items-center gap-1 bg-cta text-cta-foreground px-4 py-2 rounded-lg font-semibold hover:bg-cta-hover transition-colors text-sm">
            <ShoppingBag className="w-4 h-4" />
            Ofertas
          </a>
          <a href="/login" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <LogIn className="w-4 h-4" />
            Login
          </a>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

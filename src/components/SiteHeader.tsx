import { ShoppingBag, Flame } from 'lucide-react';

const SiteHeader = () => {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container flex items-center justify-between py-3">
        <a href="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <Flame className="w-6 h-6 text-cta" />
          <span>OfertaMax</span>
        </a>
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="hidden sm:block text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Como Funciona
          </a>
          <a href="#" className="flex items-center gap-1 bg-cta text-cta-foreground px-4 py-2 rounded-lg font-semibold hover:bg-cta-hover transition-colors text-sm">
            <ShoppingBag className="w-4 h-4" />
            Ofertas
          </a>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

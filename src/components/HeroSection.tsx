import heroBanner from '@/assets/hero-banner.jpg';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-hero py-16 md:py-24">
      <img
        src={heroBanner}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-soft-light"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/80" />

      <div className="container relative z-10 text-center">
        <p className="text-cta font-semibold tracking-widest uppercase text-sm mb-3 animate-fade-up">
          Seu radar de ofertas ativo 24h
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-gradient">Radar das Ofertas</span>
        </h1>
        <p className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Rastreamos os menores preços dos <span className="text-cta font-bold">maiores marketplaces do Brasil</span> para você.
          Economize até <span className="text-cta font-bold">70%</span> em milhares de produtos.
        </p>

        <div className="max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar produtos, marcas ou categorias..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-card text-card-foreground shadow-card-hover text-base focus:outline-none focus:ring-2 focus:ring-cta transition-shadow"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {['📡 Preços Rastreados', '💰 Até 70% OFF', '🏪 Maiores Marketplaces'].map((tag) => (
            <span key={tag} className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground/90 px-4 py-2 rounded-full text-sm font-medium border border-primary-foreground/10">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

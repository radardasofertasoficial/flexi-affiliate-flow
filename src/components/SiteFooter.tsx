import { Flame } from 'lucide-react';

const SiteFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground/60 mt-12">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-primary-foreground">
            <Flame className="w-5 h-5 text-cta" />
            Radar de Ofertas
          </div>
          <p className="text-xs text-center md:text-right max-w-md">
            Este site contém links de afiliados. Ao comprar através dos nossos links, podemos receber uma comissão sem custo adicional para você. Os preços exibidos podem variar.
          </p>
        </div>
        <div className="border-t border-primary-foreground/10 mt-6 pt-6 text-center text-xs">
          © {new Date().getFullYear()} Radar de Ofertas. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

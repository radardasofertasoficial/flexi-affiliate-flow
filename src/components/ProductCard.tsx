import { useState } from 'react';
import { Star, ExternalLink, MessageCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/database';
import LeadCaptureModal, { isLeadRegistered } from '@/components/LeadCaptureModal';
import { useActivePlatforms } from '@/hooks/usePlatforms';
import { useLeadModalConfig } from '@/hooks/useLeadModalConfig';
import { trackClickCTA } from '@/lib/tracking';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'offer' | 'pergunta' | null>(null);
  const { data: platforms = [] } = useActivePlatforms();
  const { data: modalConfig } = useLeadModalConfig();

  const platform = platforms.find(p => p.slug === product.store);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const logClickAndOpen = () => {
    supabase.from('product_clicks').insert({
      product_id: product.id,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    } as any).then(() => {});
    trackClickCTA({
      title: product.title,
      store: product.store,
      category: product.category,
      price: product.price,
    });
    window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
  };

  const handleOfferClick = () => {
    if (isLeadRegistered()) {
      logClickAndOpen();
    } else {
      setPendingAction('offer');
      setModalOpen(true);
    }
  };

  const buildWhatsAppUrl = (message: string) => {
    if (modalConfig?.whatsapp_card_link) return modalConfig.whatsapp_card_link;
    const number = modalConfig?.whatsapp_number || '5515981184423';
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsApp = (message: string) => {
    if (isLeadRegistered()) {
      window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    } else {
      setPendingAction('pergunta');
      setModalOpen(true);
    }
  };

  const handleModalSuccess = () => {
    if (pendingAction === 'offer') {
      logClickAndOpen();
    } else if (pendingAction === 'pergunta') {
      const msg = `Olá! Vi o produto ${product.title} no site e quero mais informações.`;
      window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    }
    setPendingAction(null);
  };

  return (
    <>
      <div
        className="group relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-up flex flex-col"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <span className="absolute top-3 left-3 z-10 bg-primary/80 text-primary-foreground text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm">
          {index + 1}
        </span>

        {product.badge && (
          <span className="absolute top-3 right-3 z-10 bg-urgency text-urgency-foreground text-xs font-bold px-3 py-1 rounded-full animate-pulse-badge">
            {product.badge}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute top-12 right-3 z-10 bg-success text-success-foreground text-xs font-bold px-2 py-0.5 rounded-md">
            -{discount}%
          </span>
        )}

        <div className="relative overflow-hidden aspect-square bg-secondary cursor-pointer" onClick={handleOfferClick}>
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 left-2">
            {platform?.logo_url ? (
              <img src={platform.logo_url} alt={platform.name} className="w-6 h-6 rounded object-contain bg-white/90 backdrop-blur-sm p-0.5" />
            ) : (
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                product.store === 'shopee'
                  ? 'bg-cta/90 text-cta-foreground'
                  : 'bg-primary/90 text-primary-foreground'
              }`}>
                {platform?.name || (product.store === 'shopee' ? 'Shopee' : 'Mercado Livre')}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-display font-semibold text-card-foreground text-sm leading-tight mb-1 line-clamp-2 cursor-pointer hover:text-cta transition-colors" onClick={handleOfferClick}>
            {product.title}
          </h3>
          <p className="text-muted-foreground text-xs mb-3 line-clamp-1 cursor-pointer" onClick={handleOfferClick}>
            {product.description}
          </p>

          <div className="flex items-center gap-1 mb-3 flex-wrap">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(Number(product.rating))
                      ? 'fill-star text-star'
                      : 'text-border'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              {product.rating} ({Number(product.reviews).toLocaleString('pt-BR')})
            </span>
            {product.show_sales && product.sales_count > 0 && (
              <span className="text-xs text-cta font-semibold ml-1">
                • {Number(product.sales_count).toLocaleString('pt-BR')} vendidos
              </span>
            )}
          </div>

          <div className="mt-auto">
            {product.original_price && (
              <span className="text-muted-foreground text-xs line-through">
                R$ {Number(product.original_price).toFixed(2).replace('.', ',')}
              </span>
            )}
            <div className="text-cta font-display font-bold text-xl">
              R$ {Number(product.price).toFixed(2).replace('.', ',')}
            </div>
          </div>

          <button
            onClick={handleOfferClick}
            className="mt-3 w-full bg-cta hover:bg-cta-hover text-cta-foreground font-semibold py-3 rounded-lg transition-all shadow-cta hover:shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            Ver Oferta
            <ExternalLink className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => handleWhatsApp(`Olá! Vi o produto ${product.title} no site e quero mais informações.`)}
              className="flex-1 flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#1da851] text-white text-[11px] font-medium py-2 px-1 rounded-lg transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{modalConfig?.whatsapp_button_text || 'Perguntar no WhatsApp'}</span>
            </button>
            {(product as any).show_views && ((product as any).views_count ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <Eye className="w-3.5 h-3.5" />
                {Number((product as any).views_count).toLocaleString('pt-BR')}
              </span>
            )}
          </div>
        </div>
      </div>

      <LeadCaptureModal
        open={modalOpen}
        onOpenChange={(val) => { setModalOpen(val); if (!val) setPendingAction(null); }}
        source="product_card"
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default ProductCard;

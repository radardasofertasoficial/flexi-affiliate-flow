import { Star, ExternalLink } from 'lucide-react';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleClick = () => {
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="group relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-up flex flex-col"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Number */}
      <span className="absolute top-3 left-3 z-10 bg-primary/80 text-primary-foreground text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm">
        {index + 1}
      </span>

      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 right-3 z-10 bg-urgency text-urgency-foreground text-xs font-bold px-3 py-1 rounded-full animate-pulse-badge">
          {product.badge}
        </span>
      )}

      {/* Discount tag */}
      {discount > 0 && (
        <span className="absolute top-12 right-3 z-10 bg-success text-success-foreground text-xs font-bold px-2 py-0.5 rounded-md">
          -{discount}%
        </span>
      )}

      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-secondary">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-2 left-2">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
            product.store === 'shopee' 
              ? 'bg-cta/90 text-cta-foreground' 
              : 'bg-primary/90 text-primary-foreground'
          }`}>
            {product.store === 'shopee' ? 'Shopee' : 'Mercado Livre'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-card-foreground text-sm leading-tight mb-1 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-muted-foreground text-xs mb-3 line-clamp-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-star text-star'
                    : 'text-border'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            {product.rating} ({product.reviews.toLocaleString('pt-BR')})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          {product.originalPrice && (
            <span className="text-muted-foreground text-xs line-through">
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
          <div className="text-cta font-display font-bold text-xl">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleClick}
          className="mt-3 w-full bg-cta hover:bg-cta-hover text-cta-foreground font-semibold py-3 rounded-lg transition-all shadow-cta hover:shadow-lg flex items-center justify-center gap-2 text-sm"
        >
          Ver Oferta
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

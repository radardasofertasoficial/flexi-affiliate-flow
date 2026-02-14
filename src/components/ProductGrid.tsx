import { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/types/database';

interface ProductGridProps {
  products: Product[];
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

const ProductGrid = ({ products }: ProductGridProps) => {
  const [sort, setSort] = useState<SortOption>('relevance');

  const sorted = useMemo(() => {
    const arr = [...products];
    switch (sort) {
      case 'price-asc': return arr.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc': return arr.sort((a, b) => Number(b.price) - Number(a.price));
      case 'rating': return arr.sort((a, b) => Number(b.rating) - Number(a.rating));
      default: return arr;
    }
  }, [products, sort]);

  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground text-sm">
          <span className="font-semibold text-foreground">{products.length}</span> produtos encontrados
        </p>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-cta"
          >
            <option value="relevance">Relevância</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
          <p className="text-muted-foreground text-sm mt-1">Tente outra busca ou categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sorted.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;

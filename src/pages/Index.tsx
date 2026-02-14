import { useState, useEffect, useMemo } from 'react';
import SiteHeader from '@/components/SiteHeader';
import HeroSection from '@/components/HeroSection';
import CategoryBar from '@/components/CategoryBar';
import ProductGrid from '@/components/ProductGrid';
import SiteFooter from '@/components/SiteFooter';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/database';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });
      setProducts((data as unknown as Product[]) || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, products]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />
      <main className="flex-1">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando produtos...</div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;

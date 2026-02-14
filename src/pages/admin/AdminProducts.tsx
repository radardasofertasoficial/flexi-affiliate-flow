import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product, ProductInsert } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Search, CalendarIcon, X } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { startOfDay, endOfDay, format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { usePlatforms, type Platform } from '@/hooks/usePlatforms';

const emptyProduct: ProductInsert = {
  title: '', price: 0, affiliate_url: '', store: 'shopee', category: 'Outros',
  description: '', original_price: null, image: '', rating: 0, reviews: 0,
  badge: '', priority: 0, featured: false, active: true,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInsert>(emptyProduct);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState('Todas');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(subDays(new Date(), 7));
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const { toast } = useToast();

  const { data: platforms = [] } = usePlatforms();

  const getPlatform = (slug: string) => platforms.find(p => p.slug === slug);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    else setProducts((data as unknown as Product[]) || []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('name').order('name');
    if (data) setCategories(data.map(c => c.name));
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyProduct); setDialogOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title, price: p.price, affiliate_url: p.affiliate_url, store: p.store,
      category: p.category, description: p.description, original_price: p.original_price,
      image: p.image, rating: p.rating, reviews: p.reviews, badge: p.badge,
      priority: p.priority, featured: p.featured, active: p.active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.affiliate_url || form.price <= 0) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' });
      return;
    }
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    if (imageExts.some(ext => form.affiliate_url.toLowerCase().endsWith(ext))) {
      toast({ title: 'Link inválido', description: 'O link de afiliado parece ser uma URL de imagem. Use o link da página do produto.', variant: 'destructive' });
      return;
    }
    if (editing) {
      const { error } = await supabase.from('products').update(form as any).eq('id', editing.id);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Produto atualizado!' });
    } else {
      const { error } = await supabase.from('products').insert(form as any);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Produto criado!' });
    }
    setDialogOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Produto excluído' });
    fetchProducts();
  };

  const toggleActive = async (p: Product) => {
    await supabase.from('products').update({ active: !p.active } as any).eq('id', p.id);
    fetchProducts();
  };

  const toggleFeatured = async (p: Product) => {
    await supabase.from('products').update({ featured: !p.featured } as any).eq('id', p.id);
    fetchProducts();
  };

  const updateField = (key: keyof ProductInsert, value: any) => setForm(f => ({ ...f, [key]: value }));

  const hasActiveFilters = selectedStore !== 'Todas' || dateFrom || dateTo || priceMin || priceMax;

  const clearFilters = () => {
    setSelectedStore('Todas');
    setDateFrom(undefined);
    setDateTo(undefined);
    setPriceMin('');
    setPriceMax('');
  };

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStore = selectedStore === 'Todas' || p.store === selectedStore;
    const matchDateFrom = !dateFrom || new Date(p.created_at) >= startOfDay(dateFrom);
    const matchDateTo = !dateTo || new Date(p.created_at) <= endOfDay(dateTo);
    const matchPriceMin = !priceMin || Number(p.price) >= parseFloat(priceMin);
    const matchPriceMax = !priceMax || Number(p.price) <= parseFloat(priceMax);
    return matchCategory && matchSearch && matchStore && matchDateFrom && matchDateTo && matchPriceMin && matchPriceMax;
  });

  const PlatformLogo = ({ slug, size = 24 }: { slug: string; size?: number }) => {
    const platform = getPlatform(slug);
    if (platform?.logo_url) {
      return <img src={platform.logo_url} alt={platform.name} className="rounded object-contain bg-white" style={{ width: size, height: size }} title={platform.name} />;
    }
    return <span className="text-xs text-muted-foreground" title={slug}>{platform?.name || slug}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Produtos</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-cta hover:bg-cta-hover text-cta-foreground">
              <Plus className="w-4 h-4 mr-2" /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 space-y-2">
                <Label>Link Afiliado *</Label>
                <Input value={form.affiliate_url} onChange={e => updateField('affiliate_url', e.target.value)} placeholder="https://..." />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Título *</Label>
                <Input value={form.title} onChange={e => updateField('title', e.target.value)} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Descrição</Label>
                <Input value={form.description || ''} onChange={e => updateField('description', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Preço *</Label>
                <Input type="number" step="0.01" value={form.price} onChange={e => updateField('price', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Preço Original</Label>
                <Input type="number" step="0.01" value={form.original_price || ''} onChange={e => updateField('original_price', parseFloat(e.target.value) || null)} />
              </div>
              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input value={form.image || ''} onChange={e => updateField('image', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={e => updateField('category', e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.store} onChange={e => updateField('store', e.target.value)}>
                  {platforms.filter(p => p.active).map(p => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                  {platforms.length === 0 && (
                    <>
                      <option value="shopee">Shopee</option>
                      <option value="mercadolivre">Mercado Livre</option>
                    </>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Avaliação</Label>
                <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => updateField('rating', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Nº Reviews</Label>
                <Input type="number" value={form.reviews} onChange={e => updateField('reviews', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Badge (emoji + texto)</Label>
                <Input value={form.badge || ''} onChange={e => updateField('badge', e.target.value)} placeholder="🔥 Mais Vendido" />
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Input type="number" value={form.priority} onChange={e => updateField('priority', parseInt(e.target.value) || 0)} />
              </div>
              <div className="col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} className="rounded" />
                  Destaque
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.active} onChange={e => updateField('active', e.target.checked)} className="rounded" />
                  Ativo
                </label>
              </div>
              <div className="col-span-2">
                <Button onClick={handleSave} className="w-full bg-cta hover:bg-cta-hover text-cta-foreground">
                  {editing ? 'Salvar Alterações' : 'Criar Produto'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {['Todos', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cta text-cta-foreground shadow-cta'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Store filter - dynamic from platforms */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setSelectedStore('Todas')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedStore === 'Todas'
                ? 'bg-cta text-cta-foreground shadow-cta'
                : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Todas
          </button>
          {platforms.map(p => (
            <button
              key={p.slug}
              onClick={() => setSelectedStore(p.slug)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedStore === p.slug
                  ? 'bg-cta text-cta-foreground shadow-cta'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {p.logo_url && <img src={p.logo_url} alt="" className="w-4 h-4 rounded object-contain" />}
              {p.name}
            </button>
          ))}
        </div>

        {/* Search, dates, price */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar produto..."
              className="pl-9"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal text-xs", !dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "De"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" locale={ptBR} />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal text-xs", !dateTo && "text-muted-foreground")}>
                <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Até"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" locale={ptBR} />
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">R$</span>
            <Input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-[80px] h-9 text-xs" />
            <span className="text-xs text-muted-foreground">-</span>
            <Input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-[80px] h-9 text-xs" />
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
              <X className="w-3.5 h-3.5 mr-1" /> Limpar filtros
            </Button>
          )}
        </div>

        <span className="text-sm text-muted-foreground">
          {filteredProducts.length === products.length
            ? `${products.length} produtos`
            : `${filteredProducts.length} de ${products.length} produtos`}
        </span>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">{products.length === 0 ? 'Nenhum produto cadastrado.' : 'Nenhum produto encontrado.'}</p>
          {products.length === 0 && <p className="text-sm text-muted-foreground mt-1">Clique em "Novo Produto" para começar.</p>}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-center p-3 font-medium text-muted-foreground w-[60px]">Plataforma</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Produto</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Categoria</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Preço</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3 text-center">
                    <div className="flex justify-center">
                      <PlatformLogo slug={p.store} />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.image && <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" />}
                      <p className="font-medium text-foreground line-clamp-1">{p.title}</p>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3 text-right font-medium">R$ {Number(p.price).toFixed(2).replace('.', ',')}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => toggleActive(p)} title={p.active ? 'Desativar' : 'Ativar'}>
                        {p.active ? <Eye className="w-4 h-4 text-success" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <button onClick={() => toggleFeatured(p)} title={p.featured ? 'Remover destaque' : 'Destacar'}>
                        <Star className={`w-4 h-4 ${p.featured ? 'fill-star text-star' : 'text-muted-foreground'}`} />
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

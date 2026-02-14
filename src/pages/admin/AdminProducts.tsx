import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product, ProductInsert } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Loader2, Link } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

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
  const [scraping, setScraping] = useState(false);
  const { toast } = useToast();

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

  const handleScrape = async () => {
    if (!form.affiliate_url) {
      toast({ title: 'Cole o link do produto primeiro', variant: 'destructive' });
      return;
    }
    setScraping(true);
    try {
      const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
        body: { url: form.affiliate_url },
      });
      if (error) throw error;
      if (data?.success) {
        setForm(f => ({
          ...f,
          title: data.title || f.title,
          description: data.description || f.description,
          image: data.image || f.image,
          price: data.price || f.price,
        }));
        toast({ title: 'Dados extraídos com sucesso!' });
      } else {
        toast({ title: 'Não foi possível extrair dados', description: data?.error, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Erro no scraping', description: err.message, variant: 'destructive' });
    } finally {
      setScraping(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.affiliate_url || form.price <= 0) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' });
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
              {/* Scrape section */}
              <div className="col-span-2 space-y-2">
                <Label>Link Afiliado *</Label>
                <div className="flex gap-2">
                  <Input value={form.affiliate_url} onChange={e => updateField('affiliate_url', e.target.value)} placeholder="https://..." className="flex-1" />
                  <Button type="button" variant="outline" onClick={handleScrape} disabled={scraping}>
                    {scraping ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Link className="w-4 h-4 mr-2" />}
                    {scraping ? 'Extraindo...' : 'Extrair dados'}
                  </Button>
                </div>
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
                <Label>Loja</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.store} onChange={e => updateField('store', e.target.value)}>
                  <option value="shopee">Shopee</option>
                  <option value="mercadolivre">Mercado Livre</option>
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

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Nenhum produto cadastrado.</p>
          <p className="text-sm text-muted-foreground mt-1">Clique em "Novo Produto" para começar.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Produto</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Categoria</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Preço</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.image && <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" />}
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.store}</p>
                      </div>
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

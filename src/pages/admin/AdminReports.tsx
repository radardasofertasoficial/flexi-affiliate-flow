import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Download, BarChart3, CalendarIcon, Trophy, TrendingUp, ChevronDown, Filter, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ClickReport {
  product_id: string;
  title: string;
  image: string | null;
  category: string;
  clicks: number;
  price: number;
  affiliate_url: string;
}

const AdminReports = () => {
  const [report, setReport] = useState<ClickReport[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState<Date>(startOfDay(new Date()));
  const [dateTo, setDateTo] = useState<Date>(endOfDay(new Date()));
  const [clickFilter, setClickFilter] = useState<'all' | 'with' | 'without'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const { toast } = useToast();

  const fetchReport = async () => {
    setLoading(true);

    const { data: clicks, error } = await supabase
      .from('product_clicks')
      .select('product_id')
      .gte('clicked_at', dateFrom.toISOString())
      .lte('clicked_at', dateTo.toISOString());

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const { data: products } = await supabase
      .from('products')
      .select('id, title, image, category, price, affiliate_url');

    const clickCount: Record<string, number> = {};
    (clicks || []).forEach((c: any) => {
      clickCount[c.product_id] = (clickCount[c.product_id] || 0) + 1;
    });

    const rows: ClickReport[] = [];
    ((products as any[]) || []).forEach((p: any) => {
      rows.push({
        product_id: p.id,
        title: p.title,
        image: p.image,
        category: p.category,
        price: p.price,
        affiliate_url: p.affiliate_url,
        clicks: clickCount[p.id] || 0,
      });
    });

    // Also add clicked products that may have been removed
    Object.entries(clickCount).forEach(([product_id, count]) => {
      if (!rows.find(r => r.product_id === product_id)) {
        rows.push({
          product_id,
          title: 'Produto removido',
          image: null,
          category: 'Sem categoria',
          price: 0,
          affiliate_url: '#',
          clicks: count,
        });
      }
    });

    rows.sort((a, b) => b.clicks - a.clicks);

    setReport(rows);
    setTotalClicks((clicks || []).length);
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilter = () => {
    fetchReport();
  };

  // Category stats
  const categoryClicks: Record<string, number> = {};
  report.forEach((r) => {
    categoryClicks[r.category] = (categoryClicks[r.category] || 0) + r.clicks;
  });
  const sortedCategories = Object.entries(categoryClicks)
    .map(([name, clicks]) => ({ name, clicks }))
    .sort((a, b) => b.clicks - a.clicks);
  const top3Categories = sortedCategories.slice(0, 3);
  const restCategories = sortedCategories.slice(3);

  // Apply filters
  const filteredReport = report.filter(r => {
    if (clickFilter === 'with' && r.clicks === 0) return false;
    if (clickFilter === 'without' && r.clicks > 0) return false;
    if (selectedCategory && r.category !== selectedCategory) return false;
    return true;
  });

  const productsWithClicks = report.filter(r => r.clicks > 0).length;
  const totalProducts = report.length;
  const topProduct = report.find(r => r.clicks > 0);

  const top5 = filteredReport.filter(r => r.clicks > 0).slice(0, 5);
  const rest = clickFilter === 'without'
    ? filteredReport
    : filteredReport.slice(filteredReport.filter(r => r.clicks > 0).length > 5 ? 5 : filteredReport.filter(r => r.clicks > 0).length);

  // Simplify rest: everything not in top5
  const top5Ids = new Set(top5.map(r => r.product_id));
  const restItems = filteredReport.filter(r => !top5Ids.has(r.product_id));

  const exportCSV = () => {
    const header = 'Produto,Categoria,Cliques,Preço\n';
    const rows = report.map((r) => `"${r.title}","${r.category}",${r.clicks},${r.price}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-cliques-${format(dateFrom, 'yyyy-MM-dd')}_${format(dateTo, 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ProductImage = ({ item, size = 'md' }: { item: ClickReport; size?: 'sm' | 'md' }) => {
    const sizeClass = size === 'sm' ? 'w-10 h-10' : 'w-16 h-16';
    const content = item.image ? (
      <img src={item.image} alt={item.title} className={cn(sizeClass, "rounded-lg object-cover cursor-pointer hover:opacity-80 transition")} />
    ) : (
      <div className={cn(sizeClass, "rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-[10px]")}>Sem img</div>
    );

    if (item.affiliate_url && item.affiliate_url !== '#') {
      return (
        <a href={item.affiliate_url} target="_blank" rel="noopener noreferrer" title="Abrir anúncio">
          {content}
        </a>
      );
    }
    return content;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Relatórios</h1>
        <Button onClick={exportCSV} variant="outline" disabled={report.length === 0}>
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap items-end gap-3 mb-6 bg-card rounded-xl border border-border p-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">De</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateFrom, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={(d) => d && setDateFrom(startOfDay(d))} initialFocus className="p-3 pointer-events-auto" locale={ptBR} />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Até</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateTo, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={(d) => d && setDateTo(endOfDay(d))} initialFocus className="p-3 pointer-events-auto" locale={ptBR} />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleFilter} className="h-10">Filtrar</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total de Cliques</p>
          <p className="text-3xl font-display font-bold text-cta">{totalClicks}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Produtos com Cliques</p>
          <p className="text-3xl font-display font-bold">{productsWithClicks} <span className="text-base font-normal text-muted-foreground">de {totalProducts}</span></p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Mais Clicado</p>
          {topProduct ? (
            <div className="flex items-center gap-3 mt-1">
              <ProductImage item={topProduct} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" title={topProduct.title}>{topProduct.title}</p>
                <p className="text-xs text-muted-foreground">{topProduct.clicks} cliques • R$ {topProduct.price.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <p className="text-lg font-display font-bold">—</p>
          )}
        </div>
      </div>

      {/* Category Ranking */}
      {sortedCategories.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <h2 className="font-display text-lg font-bold mb-3">Categorias Mais Clicadas</h2>
          <div className="space-y-2">
            {top3Categories.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition text-left",
                  selectedCategory === cat.name
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-secondary/50"
                )}
              >
                {i === 0 ? <Trophy className="w-5 h-5 text-cta shrink-0" /> : <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">#{i + 1}</span>}
                <span className="font-medium flex-1">{cat.name}</span>
                <span className="text-sm text-muted-foreground">{cat.clicks} cliques</span>
              </button>
            ))}
          </div>
          {restCategories.length > 0 && (
            <Collapsible open={showAllCategories} onOpenChange={setShowAllCategories}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="mt-2 w-full text-muted-foreground">
                  <ChevronDown className={cn("w-4 h-4 mr-1 transition-transform", showAllCategories && "rotate-180")} />
                  {showAllCategories ? 'Recolher' : `Ver todas (+${restCategories.length} categorias)`}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {restCategories.map((cat, i) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition text-left",
                      selectedCategory === cat.name
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-secondary/50"
                    )}
                  >
                    <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">#{i + 4}</span>
                    <span className="font-medium flex-1">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">{cat.clicks} cliques</span>
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      )}

      {/* Active filter indicator */}
      {selectedCategory && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Filter className="w-4 h-4 text-primary" />
          <span>Filtrando por: <strong>{selectedCategory}</strong></span>
          <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="text-xs h-6 px-2">Limpar</Button>
        </div>
      )}

      {/* Click filter tabs */}
      <div className="flex gap-2 mb-6">
        {([['all', 'Todos'], ['with', 'Com cliques'], ['without', 'Sem cliques']] as const).map(([value, label]) => (
          <Button
            key={value}
            variant={clickFilter === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setClickFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filteredReport.length === 0 ? (
        <div className="text-center py-20">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum produto encontrado com esses filtros.</p>
        </div>
      ) : (
        <>
          {/* Top 5 - only show when not filtering "without clicks" */}
          {clickFilter !== 'without' && top5.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-cta" />
                <h2 className="font-display text-lg font-bold">Top 5 Mais Clicados</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {top5.map((r, i) => (
                  <div key={r.product_id} className="bg-card rounded-xl border border-border p-4 flex flex-col items-center text-center gap-2">
                    <span className="text-xs font-bold text-cta">#{i + 1}</span>
                    <ProductImage item={r} />
                    <p className="text-sm font-medium leading-tight line-clamp-2">{r.title}</p>
                    <span className="text-xs text-muted-foreground">{r.category}</span>
                    <span className="text-xs text-muted-foreground">R$ {r.price.toFixed(2)}</span>
                    <span className="text-lg font-bold text-cta">{r.clicks}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rest */}
          {restItems.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold mb-3">
                {clickFilter === 'without' ? 'Produtos Sem Cliques' : 'Demais Produtos'}
              </h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Imagem</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Produto</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Categoria</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Preço</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Cliques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restItems.map((r, i) => (
                      <tr key={r.product_id} className="border-b border-border last:border-0">
                        <td className="p-3 text-muted-foreground">{clickFilter === 'without' ? i + 1 : i + 6}</td>
                        <td className="p-3">
                          <ProductImage item={r} size="sm" />
                        </td>
                        <td className="p-3 font-medium">{r.title}</td>
                        <td className="p-3 text-muted-foreground">{r.category}</td>
                        <td className="p-3 text-right text-muted-foreground">R$ {r.price.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold text-cta">{r.clicks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminReports;

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, BarChart3, CalendarIcon, Trophy, TrendingUp } from 'lucide-react';
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
}

const AdminReports = () => {
  const [report, setReport] = useState<ClickReport[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState<Date>(startOfDay(new Date()));
  const [dateTo, setDateTo] = useState<Date>(endOfDay(new Date()));
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
      .select('id, title, image, category');

    const clickCount: Record<string, number> = {};
    (clicks || []).forEach((c: any) => {
      clickCount[c.product_id] = (clickCount[c.product_id] || 0) + 1;
    });

    const productMap: Record<string, { title: string; image: string | null; category: string }> = {};
    ((products as any[]) || []).forEach((p: any) => {
      productMap[p.id] = { title: p.title, image: p.image, category: p.category };
    });

    const rows: ClickReport[] = Object.entries(clickCount)
      .map(([product_id, clicks]) => ({
        product_id,
        title: productMap[product_id]?.title || 'Produto removido',
        image: productMap[product_id]?.image || null,
        category: productMap[product_id]?.category || 'Sem categoria',
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks);

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
  const topCategory = Object.entries(categoryClicks).sort((a, b) => b[1] - a[1])[0];

  const top5 = report.slice(0, 5);
  const rest = report.slice(5);

  const exportCSV = () => {
    const header = 'Produto,Categoria,Cliques\n';
    const rows = report.map((r) => `"${r.title}","${r.category}",${r.clicks}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-cliques-${format(dateFrom, 'yyyy-MM-dd')}_${format(dateTo, 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total de Cliques</p>
          <p className="text-3xl font-display font-bold text-cta">{totalClicks}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Produtos com Cliques</p>
          <p className="text-3xl font-display font-bold">{report.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Média por Produto</p>
          <p className="text-3xl font-display font-bold">
            {report.length > 0 ? (totalClicks / report.length).toFixed(1) : '0'}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Mais Clicado</p>
          <p className="text-lg font-display font-bold truncate" title={top5[0]?.title}>
            {top5[0]?.title || '—'}
          </p>
          {top5[0] && <p className="text-xs text-muted-foreground">{top5[0].clicks} cliques</p>}
        </div>
      </div>

      {/* Top Category */}
      {topCategory && (
        <div className="bg-card rounded-xl border border-border p-5 mb-6 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-cta shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Categoria Mais Clicada</p>
            <p className="text-xl font-display font-bold">{topCategory[0]} <span className="text-sm font-normal text-muted-foreground">({topCategory[1]} cliques)</span></p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : report.length === 0 ? (
        <div className="text-center py-20">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum clique registrado neste período.</p>
        </div>
      ) : (
        <>
          {/* Top 5 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-cta" />
              <h2 className="font-display text-lg font-bold">Top 5 Mais Clicados</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {top5.map((r, i) => (
                <div key={r.product_id} className="bg-card rounded-xl border border-border p-4 flex flex-col items-center text-center gap-2">
                  <span className="text-xs font-bold text-cta">#{i + 1}</span>
                  {r.image ? (
                    <img src={r.image} alt={r.title} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs">Sem img</div>
                  )}
                  <p className="text-sm font-medium leading-tight line-clamp-2">{r.title}</p>
                  <span className="text-xs text-muted-foreground">{r.category}</span>
                  <span className="text-lg font-bold text-cta">{r.clicks}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rest */}
          {rest.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold mb-3">Demais Produtos Clicados</h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Imagem</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Produto</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Categoria</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Cliques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((r, i) => (
                      <tr key={r.product_id} className="border-b border-border last:border-0">
                        <td className="p-3 text-muted-foreground">{i + 6}</td>
                        <td className="p-3">
                          {r.image ? (
                            <img src={r.image} alt={r.title} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-muted-foreground text-[10px]">Sem img</div>
                          )}
                        </td>
                        <td className="p-3 font-medium">{r.title}</td>
                        <td className="p-3 text-muted-foreground">{r.category}</td>
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

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClickReport {
  product_id: string;
  title: string;
  clicks: number;
}

const AdminReports = () => {
  const [report, setReport] = useState<ClickReport[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      // Get all clicks with product info
      const { data: clicks, error } = await supabase
        .from('product_clicks')
        .select('product_id');

      if (error) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { data: products } = await supabase
        .from('products')
        .select('id, title');

      const clickCount: Record<string, number> = {};
      (clicks || []).forEach((c: any) => {
        clickCount[c.product_id] = (clickCount[c.product_id] || 0) + 1;
      });

      const productMap: Record<string, string> = {};
      ((products as any[]) || []).forEach((p: any) => { productMap[p.id] = p.title; });

      const rows: ClickReport[] = Object.entries(clickCount)
        .map(([product_id, clicks]) => ({
          product_id,
          title: productMap[product_id] || 'Produto removido',
          clicks,
        }))
        .sort((a, b) => b.clicks - a.clicks);

      setReport(rows);
      setTotalClicks((clicks || []).length);
      setLoading(false);
    };
    fetchReport();
  }, []);

  const exportCSV = () => {
    const header = 'Produto,Cliques\n';
    const rows = report.map(r => `"${r.title}",${r.clicks}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-cliques-${new Date().toISOString().slice(0, 10)}.csv`;
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

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Total de Cliques</p>
          <p className="text-3xl font-display font-bold text-cta">{totalClicks}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Produtos com Cliques</p>
          <p className="text-3xl font-display font-bold">{report.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Média por Produto</p>
          <p className="text-3xl font-display font-bold">
            {report.length > 0 ? (totalClicks / report.length).toFixed(1) : '0'}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : report.length === 0 ? (
        <div className="text-center py-20">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum clique registrado ainda.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Produto</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Cliques</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r, i) => (
                <tr key={r.product_id} className="border-b border-border last:border-0">
                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3 text-right font-bold text-cta">{r.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReports;

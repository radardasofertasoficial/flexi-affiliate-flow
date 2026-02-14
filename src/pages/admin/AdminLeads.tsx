import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Lead {
  id: string;
  name: string;
  phone: string;
  lead_type: string;
  message: string;
  source: string;
  tags: string[];
  created_at: string;
}

const typeLabels: Record<string, string> = {
  top10_ofertas: 'Top 10 Ofertas',
  radar_ofertas: 'Radar das Ofertas',
  cupom_exclusivo: 'Cupom Exclusivo',
  alerta_promo: 'Alerta Promoção',
  ofertas_exclusivas: 'Ofertas Exclusivas',
  recomendacao: 'Recomendação',
  produto_vale_pena: 'Vale a Pena?',
  produto_pergunta: 'Pergunta Produto',
};

const sourceLabels: Record<string, string> = {
  popup_15s: 'Pop-up 15s',
  whatsapp_float: 'Botão Flutuante',
  product_card: 'Card Produto',
  como_funciona: 'Como Funciona',
};

const tagColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
];

const allTags = [
  'Roupas', 'Eletrônicos', 'Ferramentas',
  'Casa e Decoração', 'Beleza e Saúde', 'Esportes', 'Outros'
];

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const filteredLeads = filterTag
    ? leads.filter(l => l.tags?.includes(filterTag))
    : leads;

  const tagCounts: Record<string, number> = {};
  leads.forEach(l => (l.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const exportExcel = () => {
    const header = 'Nome,WhatsApp,Tipo,Mensagem,Origem,Etiquetas,Data\n';
    const rows = filteredLeads.map(l =>
      `"${l.name || ''}","${l.phone || ''}","${typeLabels[l.lead_type] || l.lead_type}","${l.message}","${sourceLabels[l.source] || l.source}","${(l.tags || []).join(', ')}","${new Date(l.created_at).toLocaleString('pt-BR')}"`
    ).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      setLeads(prev => prev.filter(l => l.id !== id));
      toast({ title: 'Lead removido' });
    }
  };

  const getTagColor = (tag: string) => {
    const idx = allTags.indexOf(tag);
    return tagColors[idx >= 0 ? idx : tagColors.length - 1];
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '—';
    const d = phone.replace(/\D/g, '');
    if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return phone;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Leads WhatsApp</h1>
        <Button onClick={exportExcel} variant="outline" disabled={filteredLeads.length === 0}>
          <Download className="w-4 h-4 mr-2" /> Exportar CSV/Excel
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Total de Leads</p>
          <p className="text-3xl font-display font-bold text-cta">{leads.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Com Contato</p>
          <p className="text-3xl font-display font-bold text-green-600">
            {leads.filter(l => l.name && l.phone).length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Sem Contato</p>
          <p className="text-3xl font-display font-bold text-orange-500">
            {leads.filter(l => !l.name || !l.phone).length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Top Etiquetas</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {topTags.length > 0 ? topTags.map(([tag, count]) => (
              <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTagColor(tag)}`}>
                {tag} ({count})
              </span>
            )) : <span className="text-xs text-muted-foreground">—</span>}
          </div>
        </div>
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterTag(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            !filterTag ? 'bg-cta text-white border-cta' : 'bg-secondary text-secondary-foreground border-border hover:border-cta/50'
          }`}
        >
          Todos
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilterTag(filterTag === tag ? null : tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filterTag === tag ? 'bg-cta text-white border-cta' : 'bg-secondary text-secondary-foreground border-border hover:border-cta/50'
            }`}
          >
            {tag} {tagCounts[tag] ? `(${tagCounts[tag]})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum lead encontrado.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
                <th className="text-left p-3 font-medium text-muted-foreground">WhatsApp</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Tipo</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Etiquetas</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Origem</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l, i) => (
                <tr key={l.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                  <td className="p-3 font-medium">{l.name || <span className="text-muted-foreground">—</span>}</td>
                  <td className="p-3">
                    {l.phone ? (
                      <a
                        href={`https://wa.me/55${l.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-medium"
                      >
                        {formatPhone(l.phone)}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary">{typeLabels[l.lead_type] || l.lead_type}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {(l.tags || []).length > 0 ? l.tags.map(tag => (
                        <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      )) : <span className="text-xs text-muted-foreground">—</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline">{sourceLabels[l.source] || l.source}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString('pt-BR')}
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteLead(l.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
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

export default AdminLeads;

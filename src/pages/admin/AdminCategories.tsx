import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

type Category = { id: string; name: string; created_at: string };

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const { toast } = useToast();

  const fetch_ = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    else setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    const { error } = await supabase.from('categories').insert({ name });
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Categoria criada!' });
    setNewName('');
    fetch_();
  };

  const handleUpdate = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const { error } = await supabase.from('categories').update({ name }).eq('id', id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Categoria atualizada!' });
    setEditingId(null);
    fetch_();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir a categoria "${name}"?`)) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Categoria excluída' });
    fetch_();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Categorias</h1>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Nova categoria..."
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="max-w-xs"
        />
        <Button onClick={handleAdd} className="bg-cta hover:bg-cta-hover text-cta-foreground">
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma categoria cadastrada.</p>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
                <th className="text-right p-3 font-medium text-muted-foreground w-32">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3">
                    {editingId === cat.id ? (
                      <Input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.id)}
                        className="max-w-xs h-8"
                        autoFocus
                      />
                    ) : (
                      <span className="text-foreground font-medium">{cat.name}</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {editingId === cat.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleUpdate(cat.id)}>
                          <Check className="w-4 h-4 text-success" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id, cat.name)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    )}
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

export default AdminCategories;

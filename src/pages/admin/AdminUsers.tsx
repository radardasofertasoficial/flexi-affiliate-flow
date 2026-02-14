import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const { data, error } = await supabase.functions.invoke('manage-users', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      toast({ title: 'Erro ao carregar usuários', description: error.message, variant: 'destructive' });
    } else {
      setUsers(data?.users || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (targetId: string, email: string) => {
    if (!confirm(`Remover o usuário ${email}? Esta ação é irreversível.`)) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const { data, error } = await supabase.functions.invoke('manage-users', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      body: { user_id: targetId },
    });

    if (error || !data?.success) {
      toast({ title: 'Erro', description: error?.message || data?.error || 'Falha ao remover', variant: 'destructive' });
    } else {
      toast({ title: 'Usuário removido!' });
      fetchUsers();
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" /> Usuários
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
        </div>
      ) : users.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">Nenhum usuário cadastrado.</p>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Cadastro</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Último Login</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3 text-foreground">{u.email}</td>
                  <td className="p-3 text-muted-foreground">{formatDate(u.created_at)}</td>
                  <td className="p-3 text-muted-foreground">{formatDate(u.last_sign_in_at)}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id, u.email || '')}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 text-xs text-muted-foreground border-t border-border">
            {users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

import { useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Package, BarChart3, LogOut, Flame, Home, Tags, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-cta text-cta-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-cta" />
            <span className="font-display font-bold text-lg">Radar Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            <Package className="w-4 h-4" /> Produtos
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            <Tags className="w-4 h-4" /> Categorias
          </NavLink>
          <NavLink to="/admin/reports" className={linkClass}>
            <BarChart3 className="w-4 h-4" /> Relatórios
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            <Users className="w-4 h-4" /> Usuários
          </NavLink>
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <a href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Home className="w-4 h-4" /> Ver Loja
          </a>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

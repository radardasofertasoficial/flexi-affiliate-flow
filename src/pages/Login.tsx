import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setIsLoading(false);
    if (error) {
      toast({ title: isSignUp ? 'Erro ao cadastrar' : 'Erro ao entrar', description: error.message, variant: 'destructive' });
    } else {
      if (isSignUp) {
        toast({ title: 'Conta criada!', description: 'Agora faça login.' });
        setIsSignUp(false);
      } else {
        navigate('/admin');
      }
    }
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-xl p-8 shadow-card-hover">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Flame className="w-8 h-8 text-cta" />
          <span className="font-display font-bold text-2xl text-card-foreground">Radar de Ofertas</span>
        </div>
        <h1 className="font-display text-xl text-center text-card-foreground mb-6">{isSignUp ? 'Criar Conta' : 'Painel Administrativo'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full bg-cta hover:bg-cta-hover text-cta-foreground" disabled={isLoading}>
            <LogIn className="w-4 h-4 mr-2" />
            {isLoading ? (isSignUp ? 'Cadastrando...' : 'Entrando...') : (isSignUp ? 'Cadastrar' : 'Entrar')}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {isSignUp ? 'Já tem conta?' : 'Não tem conta?'}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-cta hover:underline font-medium">
            {isSignUp ? 'Fazer login' : 'Cadastre-se'}
          </button>
        </p>
        <p className="text-center text-xs text-muted-foreground mt-4">
          <a href="/" className="hover:text-foreground transition-colors">← Voltar para a loja</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

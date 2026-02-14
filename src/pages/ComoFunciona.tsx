import { useState } from 'react';
import { AlertTriangle, Clock, TrendingUp, Package, Radar, BadgePercent, MousePointerClick, Smartphone, Home, Baby, Shirt, ShoppingCart, Gamepad2, Sparkles, Timer, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Send } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const phoneNumber = '5515981184423';

const interestTags = [
  'Roupas', 'Eletronicos', 'Ferramentas',
  'Casa e Decoracao', 'Beleza e Saude', 'Esportes', 'Outros'
];

const leadOptions = [
  { label: '📋 Lista das 10 melhores ofertas do mês', message: 'Quero a lista das 10 melhores ofertas do mês!', type: 'top10_ofertas' },
  { label: '🔥 Entre para o Radar das Ofertas', message: 'Quero entrar para o Radar das Ofertas!', type: 'radar_ofertas' },
  { label: '🎟️ Cupom exclusivo', message: 'Quero meu cupom exclusivo!', type: 'cupom_exclusivo' },
  { label: '⚡ Alerta de promoção relâmpago', message: 'Quero receber alertas de promoção relâmpago!', type: 'alerta_promo' },
];

const ComoFunciona = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedOption, setSelectedOption] = useState<typeof leadOptions[0] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleOptionClick = (option: typeof leadOptions[0]) => {
    setSelectedOption(option);
    setSelectedTags([]);
    setStep(2);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSend = async () => {
    if (!selectedOption) return;
    const finalMessage = selectedTags.length > 0
      ? `${selectedOption.message} Interesses: ${selectedTags.join(', ')}`
      : selectedOption.message;
    try {
      await (supabase.from('leads') as any).insert({
        lead_type: selectedOption.type,
        message: finalMessage,
        source: 'como_funciona',
        tags: selectedTags,
      });
    } catch (e) {}
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`, '_blank');
    setOpen(false);
    setStep(1);
    setSelectedOption(null);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) { setStep(1); setSelectedOption(null); setSelectedTags([]); }
  };

  const openLeadModal = () => setOpen(true);

  const problems = [
    { icon: AlertTriangle, text: 'Oferta esgotada antes de você ver' },
    { icon: Clock, text: 'Cupom expirado quando tentou usar' },
    { icon: TrendingUp, text: 'Preço subiu minutos depois' },
    { icon: Package, text: 'Estoque acabou rápido demais' },
  ];

  const steps = [
    { icon: Radar, num: '1', title: 'Monitoramos promoções 24h por dia', desc: 'Rastreamos as maiores lojas do Brasil em tempo real.' },
    { icon: BadgePercent, num: '2', title: 'Publicamos apenas descontos reais', desc: 'Nada de preço maquiado. Só ofertas que valem a pena.' },
    { icon: MousePointerClick, num: '3', title: 'Você clica e compra direto na loja', desc: 'Sem intermediários. Compra segura na loja oficial.' },
  ];

  const categories = [
    { icon: Smartphone, name: 'Eletrônicos' },
    { icon: Home, name: 'Casa' },
    { icon: Baby, name: 'Infantil' },
    { icon: Shirt, name: 'Moda' },
    { icon: ShoppingCart, name: 'Mercado' },
    { icon: Gamepad2, name: 'Games' },
    { icon: Sparkles, name: 'Beleza' },
  ];

  return (
    <div className="min-h-screen scroll-smooth">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0D1B2A' }}>
        {/* Radar decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border-2 border-white/30" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white/20" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-white/10" />
        </div>
        <div className="container relative z-10 py-20 md:py-32 text-center text-white">
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up">
            Onde as melhores ofertas<br />aparecem <span style={{ color: '#FFC300' }}>primeiro.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Entre para o Radar e pare de pagar mais caro.
          </p>
          <button
            onClick={openLeadModal}
            className="inline-flex items-center gap-2 text-lg md:text-xl font-bold px-10 py-4 rounded-xl transition-transform hover:scale-105 animate-fade-up"
            style={{ backgroundColor: '#FFC300', color: '#0D1B2A', animationDelay: '0.2s' }}
          >
            QUERO ENTRAR PARA O RADAR
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-white/50 text-sm mt-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Grátis • Sem spam • Apenas ofertas reais
          </p>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="bg-white py-16 md:py-24">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12" style={{ color: '#0D1B2A' }}>
            Você já perdeu uma oferta<br />por chegar <span style={{ color: '#FFC300' }}>atrasado?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
            {problems.map((p) => (
              <div key={p.text} className="flex items-center gap-4 bg-gray-50 rounded-xl p-5 text-left">
                <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFC300' }}>
                  <p.icon className="w-6 h-6" style={{ color: '#0D1B2A' }} />
                </div>
                <p className="font-medium text-gray-700">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="text-lg font-semibold" style={{ color: '#0D1B2A' }}>
            Isso acontece todos os dias. Mas <span style={{ color: '#FFC300' }}>não para quem está no Radar.</span>
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-14" style={{ color: '#0D1B2A' }}>
            Como o Radar das Ofertas <span style={{ color: '#FFC300' }}>funciona?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
            {steps.map((s) => (
              <div key={s.num} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#0D1B2A' }}>
                  <s.icon className="w-7 h-7" style={{ color: '#FFC300' }} />
                </div>
                <span className="inline-block text-sm font-bold px-3 py-1 rounded-full mb-3" style={{ backgroundColor: '#FFC300', color: '#0D1B2A' }}>
                  Passo {s.num}
                </span>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xl font-bold" style={{ color: '#0D1B2A' }}>
            Simples. Rápido. <span style={{ color: '#FFC300' }}>Sem custo.</span>
          </p>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="bg-white py-16 md:py-24">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12" style={{ color: '#0D1B2A' }}>
            O que você encontra no Radar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-4xl mx-auto mb-10">
            {categories.map((c) => (
              <div
                key={c.name}
                className="flex flex-col items-center gap-3 rounded-2xl p-6 border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
                  <c.icon className="w-6 h-6" style={{ color: '#FFC300' }} />
                </div>
                <span className="font-semibold text-sm" style={{ color: '#0D1B2A' }}>{c.name}</span>
              </div>
            ))}
          </div>
          <p className="text-lg font-semibold text-gray-600">
            Se existe desconto real, <span className="font-bold" style={{ color: '#0D1B2A' }}>a gente encontra.</span>
          </p>
        </div>
      </section>

      {/* URGÊNCIA */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="container text-center text-white">
          <Timer className="w-14 h-14 mx-auto mb-6" style={{ color: '#FFC300' }} />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            As melhores ofertas duram <span style={{ color: '#FFC300' }}>poucos minutos.</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Muitos cupons têm limite de uso e estoques acabam rápido. Quem entra primeiro paga menos.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
            Pare de perder dinheiro.
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Entre agora para o Radar das Ofertas.
          </p>
          <button
            onClick={openLeadModal}
            className="inline-flex items-center gap-2 text-lg md:text-xl font-bold px-12 py-5 rounded-xl transition-transform hover:scale-105"
            style={{ backgroundColor: '#FFC300', color: '#0D1B2A' }}
          >
            QUERO RECEBER AS OFERTAS AGORA
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-gray-400 text-sm mt-4">100% gratuito.</p>
        </div>
      </section>

      <SiteFooter />

      {/* FIXED MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-3" style={{ backgroundColor: '#0D1B2A' }}>
        <button
          onClick={openLeadModal}
          className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: '#FFC300', color: '#0D1B2A' }}
        >
          QUERO ENTRAR PARA O RADAR
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* LEAD CAPTURE MODAL */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          {step === 1 ? (
            <>
              <DialogHeader className="text-center items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: '#FFC300' }}>
                  <Radar className="w-7 h-7" style={{ color: '#0D1B2A' }} />
                </div>
                <DialogTitle className="font-display text-xl">⚡ Entre para o Radar!</DialogTitle>
                <DialogDescription className="text-base">
                  Escolha como quer receber as melhores ofertas:
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2.5 mt-2">
                {leadOptions.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => handleOptionClick(opt)}
                    className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-medium rounded-lg px-4 py-3.5 transition-colors text-left"
                  >
                    <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current shrink-0">
                      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.962 2.04-3.222 2.31-.864.184-1.99.33-5.784-1.244-4.856-2.016-7.98-6.94-8.222-7.264-.232-.322-1.95-2.6-1.95-4.96s1.234-3.518 1.672-3.998c.438-.48.958-.6 1.278-.6.318 0 .638.002.916.016.294.016.69-.112 1.08.824.396.958 1.35 3.278 1.47 3.516.118.238.198.516.04.832-.16.318-.238.516-.478.794-.238.278-.5.62-.714.832-.238.238-.486.496-.21.974.278.478 1.234 2.036 2.65 3.298 1.82 1.622 3.354 2.124 3.832 2.362.478.238.758.198 1.036-.118.278-.318 1.196-1.394 1.514-1.874.318-.478.638-.398 1.076-.238.438.16 2.754 1.3 3.232 1.536.478.238.796.358.916.554.118.198.118 1.138-.278 2.254z" />
                    </svg>
                    {opt.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-1 mx-auto">
                Não, obrigado
              </button>
            </>
          ) : (
            <>
              <DialogHeader className="text-center items-center">
                <DialogTitle className="font-display text-lg">Que tipo de promoção te interessa?</DialogTitle>
                <DialogDescription className="text-sm">
                  Selecione uma ou mais categorias para receber ofertas personalizadas.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {interestTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-cta text-white border-cta'
                        : 'bg-secondary text-secondary-foreground border-border hover:border-cta/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Button onClick={handleSend} className="bg-[#25D366] hover:bg-[#20bd5a] text-white w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar pelo WhatsApp
                </Button>
                <button onClick={() => { setStep(1); setSelectedOption(null); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto">
                  ← Voltar
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComoFunciona;

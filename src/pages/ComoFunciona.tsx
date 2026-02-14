import { useState } from 'react';
import { AlertTriangle, Clock, TrendingUp, Package, Radar, BadgePercent, MousePointerClick, Smartphone, Home, Baby, Shirt, ShoppingCart, Gamepad2, Sparkles, Timer, ArrowRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import LeadCaptureModal from '@/components/LeadCaptureModal';

const ComoFunciona = () => {
  const [open, setOpen] = useState(false);

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
              <div key={c.name} className="flex flex-col items-center gap-3 rounded-2xl p-6 border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all cursor-default">
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

      <LeadCaptureModal
        open={open}
        onOpenChange={setOpen}
        source="como_funciona"
      />
    </div>
  );
};

export default ComoFunciona;

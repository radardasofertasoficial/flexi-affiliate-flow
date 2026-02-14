import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const interestTags = [
  'Roupas', 'Eletronicos', 'Ferramentas',
  'Casa e Decoracao', 'Beleza e Saude', 'Esportes', 'Outros'
];

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const phoneNumber = '5515981184423';

  const options = [
    { label: '📋 Lista das 10 melhores ofertas', message: 'Quero a lista das 10 melhores ofertas do mês!', type: 'top10_ofertas' },
    { label: '🔥 Entre para o Radar das Ofertas', message: 'Quero entrar para o Radar das Ofertas!', type: 'radar_ofertas' },
    { label: '🎟️ Cupom exclusivo', message: 'Quero meu cupom exclusivo!', type: 'cupom_exclusivo' },
    { label: '⚡ Alerta de promoção relâmpago', message: 'Quero receber alertas de promoção relâmpago!', type: 'alerta_promo' },
  ];

  const handleOptionClick = (opt: typeof options[0]) => {
    setSelectedOption(opt);
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
        source: 'whatsapp_float',
        tags: selectedTags,
      });
    } catch (e) {}

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`,
      '_blank'
    );
    setIsOpen(false);
    setStep(1);
    setSelectedOption(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
    setSelectedOption(null);
    setSelectedTags([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-primary text-primary-foreground rounded-xl shadow-2xl p-5 w-72 animate-fade-up">
          {step === 1 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-sm">Fale conosco no WhatsApp</h3>
                <button onClick={handleClose} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-lg leading-none" aria-label="Fechar">✕</button>
              </div>
              <div className="flex flex-col gap-2.5">
                {options.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => handleOptionClick(opt)}
                    className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-medium rounded-lg px-4 py-3 transition-colors text-left"
                  >
                    <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current shrink-0">
                      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.962 2.04-3.222 2.31-.864.184-1.99.33-5.784-1.244-4.856-2.016-7.98-6.94-8.222-7.264-.232-.322-1.95-2.6-1.95-4.96s1.234-3.518 1.672-3.998c.438-.48.958-.6 1.278-.6.318 0 .638.002.916.016.294.016.69-.112 1.08.824.396.958 1.35 3.278 1.47 3.516.118.238.198.516.04.832-.16.318-.238.516-.478.794-.238.278-.5.62-.714.832-.238.238-.486.496-.21.974.278.478 1.234 2.036 2.65 3.298 1.82 1.622 3.354 2.124 3.832 2.362.478.238.758.198 1.036-.118.278-.318 1.196-1.394 1.514-1.874.318-.478.638-.398 1.076-.238.438.16 2.754 1.3 3.232 1.536.478.238.796.358.916.554.118.198.118 1.138-.278 2.254z" />
                    </svg>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-sm">Seus interesses</h3>
                <button onClick={handleClose} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-lg leading-none" aria-label="Fechar">✕</button>
              </div>
              <p className="text-xs text-primary-foreground/70 mb-3">Selecione as categorias:</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {interestTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[#25D366] text-white'
                        : 'bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <Button onClick={handleSend} className="bg-[#25D366] hover:bg-[#20bd5a] text-white w-full text-sm" size="sm">
                <Send className="w-3.5 h-3.5 mr-1.5" /> Enviar pelo WhatsApp
              </Button>
              <button onClick={() => { setStep(1); setSelectedOption(null); }} className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors mt-2 mx-auto block">
                ← Voltar
              </button>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => isOpen ? handleClose() : setIsOpen(true)}
        aria-label="Falar no WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
      >
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse-badge border-2 border-white" />
        )}
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-current">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.962 2.04-3.222 2.31-.864.184-1.99.33-5.784-1.244-4.856-2.016-7.98-6.94-8.222-7.264-.232-.322-1.95-2.6-1.95-4.96s1.234-3.518 1.672-3.998c.438-.48.958-.6 1.278-.6.318 0 .638.002.916.016.294.016.69-.112 1.08.824.396.958 1.35 3.278 1.47 3.516.118.238.198.516.04.832-.16.318-.238.516-.478.794-.238.278-.5.62-.714.832-.238.238-.486.496-.21.974.278.478 1.234 2.036 2.65 3.298 1.82 1.622 3.354 2.124 3.832 2.362.478.238.758.198 1.036-.118.278-.318 1.196-1.394 1.514-1.874.318-.478.638-.398 1.076-.238.438.16 2.754 1.3 3.232 1.536.478.238.796.358.916.554.118.198.118 1.138-.278 2.254z" />
        </svg>
      </button>
    </div>
  );
};

export default WhatsAppFloat;

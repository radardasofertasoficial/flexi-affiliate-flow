import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Zap, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'lead_popup_seen';
const phoneNumber = '5515981184423';

const interestTags = [
  'Roupas', 'Eletronicos', 'Ferramentas',
  'Casa e Decoracao', 'Beleza e Saude', 'Esportes', 'Outros'
];

const leadOptions = [
  {
    label: '📋 Lista das 10 melhores ofertas do mês',
    message: 'Quero a lista das 10 melhores ofertas do mês!',
    type: 'top10_ofertas',
  },
  {
    label: '🔥 Entre para o Radar das Ofertas',
    message: 'Quero entrar para o Radar das Ofertas!',
    type: 'radar_ofertas',
  },
  {
    label: '🎟️ Cupom exclusivo',
    message: 'Quero meu cupom exclusivo!',
    type: 'cupom_exclusivo',
  },
  {
    label: '⚡ Alerta de promoção relâmpago',
    message: 'Quero receber alertas de promoção relâmpago!',
    type: 'alerta_promo',
  },
];

const LeadCapturePopup = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedOption, setSelectedOption] = useState<typeof leadOptions[0] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(STORAGE_KEY);
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

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
        source: 'popup_15s',
        tags: selectedTags,
      });
    } catch (e) {
      // Don't block the user
    }

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`,
      '_blank'
    );
    setOpen(false);
    setStep(1);
    setSelectedOption(null);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setStep(1);
      setSelectedOption(null);
      setSelectedTags([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 1 ? (
          <>
            <DialogHeader className="text-center items-center">
              <div className="w-14 h-14 rounded-full bg-cta/10 flex items-center justify-center mb-2 mx-auto">
                <Zap className="w-7 h-7 text-cta" />
              </div>
              <DialogTitle className="font-display text-xl">⚡ Antes de sair!</DialogTitle>
              <DialogDescription className="text-base">
                Quer receber as melhores promoções no WhatsApp?
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

            <button
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-1 mx-auto"
            >
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
              <Button
                onClick={handleSend}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar pelo WhatsApp
              </Button>
              <button
                onClick={() => { setStep(1); setSelectedOption(null); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                ← Voltar
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadCapturePopup;

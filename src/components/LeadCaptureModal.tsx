import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Radar, ArrowRight, Send } from 'lucide-react';
import { useLeadModalConfig } from '@/hooks/useLeadModalConfig';
import { trackLead } from '@/lib/tracking';

const LEAD_REGISTERED_KEY = 'lead_registered';

export function isLeadRegistered(): boolean {
  return localStorage.getItem(LEAD_REGISTERED_KEY) === 'true';
}

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: string;
  onSuccess?: () => void;
}

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const extractDigits = (masked: string): string => masked.replace(/\D/g, '');

const LeadCaptureModal = ({ open, onOpenChange, source, onSuccess }: LeadCaptureModalProps) => {
  const { data: config } = useLeadModalConfig();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedOption, setSelectedOption] = useState<{ label: string; type: string } | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const options = (config?.options ?? []).filter(opt => opt.visible !== false);
  const tags = config?.tags ?? [];
  const whatsappLink = config?.whatsapp_group_link ?? '';

  const validateStep1 = (): boolean => {
    let valid = true;
    if (name.trim().length < 2) { setNameError('Nome deve ter pelo menos 2 caracteres'); valid = false; } else setNameError('');
    const digits = extractDigits(phone);
    if (digits.length < 10 || digits.length > 11) { setPhoneError('WhatsApp inválido. Use (99) 99999-9999'); valid = false; } else setPhoneError('');
    return valid;
  };

  const handleContinue = () => { if (validateStep1()) setStep(2); };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setSubmitting(true);
    const digits = extractDigits(phone);
    const message = selectedTags.length > 0
      ? `${selectedOption.label} | Interesses: ${selectedTags.join(', ')}`
      : selectedOption.label;

    try {
      await (supabase.from('leads') as any).insert({
        name: name.trim(), phone: digits, lead_type: selectedOption.type,
        message, source, tags: selectedTags,
      });
    } catch (_) {}

    localStorage.setItem(LEAD_REGISTERED_KEY, 'true');
    trackLead({ leadType: selectedOption.type, tags: selectedTags, source });
    setSubmitting(false);
    if (onSuccess) { onSuccess(); } else { window.open(whatsappLink, '_blank', 'noopener,noreferrer'); }
    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setStep(1); setName(''); setPhone(''); setNameError(''); setPhoneError('');
    setSelectedOption(null); setSelectedTags([]);
  };

  const handleOpenChange = (val: boolean) => { onOpenChange(val); if (!val) resetState(); };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 1 ? (
          <>
            <DialogHeader className="text-center items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: '#FFC300' }}>
                <Radar className="w-7 h-7" style={{ color: '#0D1B2A' }} />
              </div>
              <DialogTitle className="font-display text-xl">{config?.step1_title}</DialogTitle>
              <DialogDescription className="text-base">{config?.step1_description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-3">
              <div>
                <Label htmlFor="lead-name" className="text-sm font-medium">Nome</Label>
                <Input id="lead-name" placeholder="Seu nome" value={name} onChange={e => { setName(e.target.value); setNameError(''); }} className="mt-1" maxLength={100} />
                {nameError && <p className="text-destructive text-xs mt-1">{nameError}</p>}
              </div>
              <div>
                <Label htmlFor="lead-phone" className="text-sm font-medium">WhatsApp</Label>
                <Input id="lead-phone" placeholder="(99) 99999-9999" value={phone} onChange={e => { setPhone(formatPhone(e.target.value)); setPhoneError(''); }} className="mt-1" type="tel" maxLength={16} />
                {phoneError && <p className="text-destructive text-xs mt-1">{phoneError}</p>}
              </div>
              <Button onClick={handleContinue} className="w-full font-bold text-base py-5" style={{ backgroundColor: '#FFC300', color: '#0D1B2A' }}>
                CONTINUAR <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="text-center items-center">
              <DialogTitle className="font-display text-lg">{config?.step2_title}</DialogTitle>
              <DialogDescription className="text-sm">{config?.step2_description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 mt-2">
              {options.map((opt) => (
                <button key={opt.type} onClick={() => setSelectedOption(opt)}
                  className={`text-left text-sm font-medium rounded-lg px-4 py-3 transition-colors border ${selectedOption?.type === opt.type ? 'border-[#FFC300] bg-[#FFC300]/10 text-foreground' : 'border-border bg-secondary text-secondary-foreground hover:border-[#FFC300]/50'}`}>
                  {opt.label}
                </button>
              ))}
              {!selectedOption && <p className="text-xs text-destructive animate-pulse-badge text-center">⚠️ Selecione uma opção acima</p>}
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {tags.map((tag) => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedTags.includes(tag) ? 'bg-[#FFC300] text-[#0D1B2A] border-[#FFC300]' : 'bg-secondary text-secondary-foreground border-border hover:border-[#FFC300]/50'}`}>
                  {tag}
                </button>
              ))}
              {selectedTags.length === 0 && <p className="text-xs text-destructive animate-pulse-badge w-full text-center mt-1">⚠️ Selecione pelo menos um interesse</p>}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={handleSubmit} disabled={!selectedOption || selectedTags.length === 0 || submitting} className="w-full font-bold text-base py-5" style={{ backgroundColor: '#FFC300', color: '#0D1B2A' }}>
                <Send className="w-4 h-4 mr-2" /> {submitting ? 'Salvando...' : 'ENTRAR NO RADAR'}
              </Button>
              <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto">← Voltar</button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;

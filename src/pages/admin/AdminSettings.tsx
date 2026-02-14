import { useState, useEffect } from 'react';
import { useLeadModalConfig, useUpdateLeadModalConfig, type LeadOption } from '@/hooks/useLeadModalConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { data: config, isLoading } = useLeadModalConfig();
  const updateConfig = useUpdateLeadModalConfig();

  const [step1Title, setStep1Title] = useState('');
  const [step1Desc, setStep1Desc] = useState('');
  const [step2Title, setStep2Title] = useState('');
  const [step2Desc, setStep2Desc] = useState('');
  const [options, setOptions] = useState<LeadOption[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    if (config) {
      setStep1Title(config.step1_title);
      setStep1Desc(config.step1_description);
      setStep2Title(config.step2_title);
      setStep2Desc(config.step2_description);
      setOptions(config.options);
      setTags(config.tags);
      setWhatsappLink(config.whatsapp_group_link);
      setWhatsappNumber(config.whatsapp_number);
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync({
        step1_title: step1Title,
        step1_description: step1Desc,
        step2_title: step2Title,
        step2_description: step2Desc,
        options,
        tags,
        whatsapp_group_link: whatsappLink,
        whatsapp_number: whatsappNumber,
      });
      toast.success('Configurações salvas!');
    } catch {
      toast.error('Erro ao salvar configurações');
    }
  };

  const updateOption = (i: number, field: keyof LeadOption, value: string) => {
    setOptions(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: value } : o));
  };

  const addOption = () => setOptions(prev => [...prev, { label: '', type: '' }]);
  const removeOption = (i: number) => setOptions(prev => prev.filter((_, idx) => idx !== i));

  const addTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t]);
      setNewTag('');
    }
  };
  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cta" />
          <h1 className="text-2xl font-display font-bold">Configurações do Modal</h1>
        </div>
        <Button onClick={handleSave} disabled={updateConfig.isPending} className="bg-cta text-cta-foreground hover:bg-cta/90">
          {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </div>

      {/* WhatsApp */}
      <Card>
        <CardHeader><CardTitle className="text-base">WhatsApp</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Número do WhatsApp (com DDI+DDD)</Label>
            <Input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="5515981184423" className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">Formato: 55 + DDD + número (sem espaços ou traços)</p>
          </div>
          <div>
            <Label>Link do Grupo WhatsApp</Label>
            <Input value={whatsappLink} onChange={e => setWhatsappLink(e.target.value)} placeholder="https://chat.whatsapp.com/..." className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Step 1 */}
      <Card>
        <CardHeader><CardTitle className="text-base">Etapa 1 — Dados do Lead</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Título</Label>
            <Input value={step1Title} onChange={e => setStep1Title(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={step1Desc} onChange={e => setStep1Desc(e.target.value)} className="mt-1" rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Step 2 */}
      <Card>
        <CardHeader><CardTitle className="text-base">Etapa 2 — Interesses</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Título</Label>
            <Input value={step2Title} onChange={e => setStep2Title(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={step2Desc} onChange={e => setStep2Desc(e.target.value)} className="mt-1" rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Opções de Interesse</CardTitle>
            <Button size="sm" variant="outline" onClick={addOption}><Plus className="w-3 h-3 mr-1" /> Adicionar</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <Input value={opt.label} onChange={e => updateOption(i, 'label', e.target.value)} placeholder="Texto (ex: 📋 Lista das 10 melhores)" />
                <Input value={opt.type} onChange={e => updateOption(i, 'type', e.target.value)} placeholder="Tipo (ex: top10_ofertas)" className="text-xs" />
              </div>
              <Button size="icon" variant="ghost" className="text-destructive mt-1" onClick={() => removeOption(i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader><CardTitle className="text-base">Tags de Categorias</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                {tag}
                <button onClick={() => removeTag(tag)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Nova tag..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
            <Button size="sm" variant="outline" onClick={addTag}><Plus className="w-3 h-3 mr-1" /> Add</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;

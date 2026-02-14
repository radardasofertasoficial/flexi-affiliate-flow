import { useState, useEffect } from 'react';
import { useLeadModalConfig, useUpdateLeadModalConfig, type LeadOption, type BadgeOption } from '@/hooks/useLeadModalConfig';
import { usePlatforms, useUpsertPlatform, useDeletePlatform, type Platform } from '@/hooks/usePlatforms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Plus, Trash2, Save, Loader2, Pencil, Store, Tag, BarChart3 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { data: config, isLoading } = useLeadModalConfig();
  const updateConfig = useUpdateLeadModalConfig();

  const { data: platforms = [], isLoading: loadingPlatforms } = usePlatforms();
  const upsertPlatform = useUpsertPlatform();
  const deletePlatform = useDeletePlatform();

  const [step1Title, setStep1Title] = useState('');
  const [step1Desc, setStep1Desc] = useState('');
  const [step2Title, setStep2Title] = useState('');
  const [step2Desc, setStep2Desc] = useState('');
  const [options, setOptions] = useState<LeadOption[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [badges, setBadges] = useState<BadgeOption[]>([]);
  const [newBadge, setNewBadge] = useState('');
  const [editingBadgeIdx, setEditingBadgeIdx] = useState<number | null>(null);
  const [editingBadgeText, setEditingBadgeText] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [ga4MeasurementId, setGa4MeasurementId] = useState('');

  // Platform form state
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [pfName, setPfName] = useState('');
  const [pfSlug, setPfSlug] = useState('');
  const [pfLogo, setPfLogo] = useState('');
  const [pfActive, setPfActive] = useState(true);
  const [showPlatformForm, setShowPlatformForm] = useState(false);

  useEffect(() => {
    if (config) {
      setStep1Title(config.step1_title);
      setStep1Desc(config.step1_description);
      setStep2Title(config.step2_title);
      setStep2Desc(config.step2_description);
      setOptions(config.options);
      setTags(config.tags);
      setBadges(config.badges || []);
      setWhatsappLink(config.whatsapp_group_link);
      setWhatsappNumber(config.whatsapp_number);
      setMetaPixelId(config.meta_pixel_id || '');
      setGa4MeasurementId(config.ga4_measurement_id || '');
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
        badges,
        whatsapp_group_link: whatsappLink,
        whatsapp_number: whatsappNumber,
        meta_pixel_id: metaPixelId,
        ga4_measurement_id: ga4MeasurementId,
      });
      toast.success('Configurações salvas!');
    } catch {
      toast.error('Erro ao salvar configurações');
    }
  };

  const updateOption = (i: number, field: keyof LeadOption, value: string) => {
    setOptions(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: value } : o));
  };

  const addOption = () => setOptions(prev => [...prev, { label: '', type: '', visible: true }]);
  const toggleOptionVisibility = (i: number) => {
    setOptions(prev => prev.map((o, idx) => idx === i ? { ...o, visible: o.visible === false ? true : false } : o));
  };
  const removeOption = (i: number) => setOptions(prev => prev.filter((_, idx) => idx !== i));

  const addTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t]);
      setNewTag('');
    }
  };
  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const addBadge = () => {
    const b = newBadge.trim();
    if (b && !badges.some(x => x.text === b)) {
      setBadges(prev => [...prev, { text: b, active: true }]);
      setNewBadge('');
    }
  };
  const removeBadge = (i: number) => setBadges(prev => prev.filter((_, idx) => idx !== i));
  const toggleBadgeActive = (i: number) => setBadges(prev => prev.map((b, idx) => idx === i ? { ...b, active: !b.active } : b));
  const startEditBadge = (i: number) => { setEditingBadgeIdx(i); setEditingBadgeText(badges[i].text); };
  const saveEditBadge = () => {
    if (editingBadgeIdx !== null && editingBadgeText.trim()) {
      setBadges(prev => prev.map((b, idx) => idx === editingBadgeIdx ? { ...b, text: editingBadgeText.trim() } : b));
      setEditingBadgeIdx(null);
    }
  };

  // Platform helpers
  const generateSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '').trim();

  const openNewPlatform = () => {
    setEditingPlatform(null);
    setPfName('');
    setPfSlug('');
    setPfLogo('');
    setPfActive(true);
    setShowPlatformForm(true);
  };

  const openEditPlatform = (p: Platform) => {
    setEditingPlatform(p);
    setPfName(p.name);
    setPfSlug(p.slug);
    setPfLogo(p.logo_url || '');
    setPfActive(p.active);
    setShowPlatformForm(true);
  };

  const handleSavePlatform = async () => {
    if (!pfName || !pfSlug) {
      toast.error('Nome e slug são obrigatórios');
      return;
    }
    try {
      await upsertPlatform.mutateAsync({
        id: editingPlatform?.id,
        name: pfName,
        slug: pfSlug,
        logo_url: pfLogo || null,
        active: pfActive,
      });
      toast.success(editingPlatform ? 'Plataforma atualizada!' : 'Plataforma criada!');
      setShowPlatformForm(false);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar plataforma');
    }
  };

  const handleDeletePlatform = async (id: string) => {
    if (!confirm('Excluir esta plataforma?')) return;
    try {
      await deletePlatform.mutateAsync(id);
      toast.success('Plataforma excluída');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir');
    }
  };

  const handleTogglePlatformActive = async (p: Platform) => {
    try {
      await upsertPlatform.mutateAsync({ ...p, active: !p.active });
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

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
          <h1 className="text-2xl font-display font-bold">Configurações</h1>
        </div>
        <Button onClick={handleSave} disabled={updateConfig.isPending} className="bg-cta text-cta-foreground hover:bg-cta/90">
          {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </div>

      {/* Platforms */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-cta" />
              <CardTitle className="text-base">Plataformas</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={openNewPlatform}><Plus className="w-3 h-3 mr-1" /> Nova Plataforma</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingPlatforms ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              {platforms.map(p => (
                <div key={p.id} className={`flex items-center gap-3 p-2 rounded-lg border border-border transition-opacity ${!p.active ? 'opacity-40' : ''}`}>
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="w-8 h-8 rounded object-contain bg-white" />
                  ) : (
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">{p.name[0]}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.slug}</p>
                  </div>
                  <Switch checked={p.active} onCheckedChange={() => handleTogglePlatformActive(p)} />
                  <Button size="icon" variant="ghost" onClick={() => openEditPlatform(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeletePlatform(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              ))}

              {showPlatformForm && (
                <div className="border border-border rounded-lg p-4 space-y-3 bg-secondary/30">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Nome</Label>
                      <Input value={pfName} onChange={e => { setPfName(e.target.value); if (!editingPlatform) setPfSlug(generateSlug(e.target.value)); }} placeholder="Ex: Magalu" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Slug</Label>
                      <Input value={pfSlug} onChange={e => setPfSlug(e.target.value)} placeholder="Ex: magalu" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">URL do Logo</Label>
                    <Input value={pfLogo} onChange={e => setPfLogo(e.target.value)} placeholder="https://..." className="mt-1" />
                    {pfLogo && <img src={pfLogo} alt="preview" className="w-8 h-8 mt-2 rounded object-contain bg-white border" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={pfActive} onCheckedChange={setPfActive} />
                    <Label className="text-xs">Ativa na vitrine</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSavePlatform} disabled={upsertPlatform.isPending} className="bg-cta text-cta-foreground hover:bg-cta/90">
                      {upsertPlatform.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                      {editingPlatform ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowPlatformForm(false)}>Cancelar</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Rastreamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cta" />
            <CardTitle className="text-base">Rastreamento (Pixel & Analytics)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Meta Pixel ID</Label>
            <Input value={metaPixelId} onChange={e => setMetaPixelId(e.target.value)} placeholder="Ex: 123456789012345" className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">Encontre em business.facebook.com → Eventos → Pixel da Meta</p>
          </div>
          <div>
            <Label>Google Analytics 4 - Measurement ID</Label>
            <Input value={ga4MeasurementId} onChange={e => setGa4MeasurementId(e.target.value)} placeholder="Ex: G-XXXXXXXXXX" className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">Encontre em analytics.google.com → Administração → Fluxos de dados</p>
          </div>
        </CardContent>
      </Card>

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
            <div key={i} className={`flex gap-2 items-start transition-opacity ${opt.visible === false ? 'opacity-40' : ''}`}>
              <Switch checked={opt.visible !== false} onCheckedChange={() => toggleOptionVisibility(i)} className="mt-2" />
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

      {/* Badges */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-cta" />
            <CardTitle className="text-base">Badges de Produto</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {badges.map((badge, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg border border-border transition-opacity ${!badge.active ? 'opacity-40' : ''}`}>
              <Switch checked={badge.active} onCheckedChange={() => toggleBadgeActive(i)} />
              {editingBadgeIdx === i ? (
                <div className="flex-1 flex gap-2">
                  <Input value={editingBadgeText} onChange={e => setEditingBadgeText(e.target.value)} className="flex-1" onKeyDown={e => e.key === 'Enter' && saveEditBadge()} />
                  <Button size="sm" onClick={saveEditBadge}><Save className="w-3 h-3" /></Button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium">{badge.text}</span>
                  <Button size="icon" variant="ghost" onClick={() => startEditBadge(i)}><Pencil className="w-3.5 h-3.5" /></Button>
                </>
              )}
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeBadge(i)}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={newBadge} onChange={e => setNewBadge(e.target.value)} placeholder="Ex: 🔥 OFERTA RELÂMPAGO" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addBadge())} />
            <Button size="sm" variant="outline" onClick={addBadge}><Plus className="w-3 h-3 mr-1" /> Add</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;

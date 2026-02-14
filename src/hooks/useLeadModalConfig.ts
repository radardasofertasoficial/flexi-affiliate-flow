import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LeadOption {
  label: string;
  type: string;
  visible?: boolean;
}

export interface LeadModalConfig {
  id: string;
  step1_title: string;
  step1_description: string;
  step2_title: string;
  step2_description: string;
  options: LeadOption[];
  tags: string[];
  whatsapp_group_link: string;
  whatsapp_number: string;
  updated_at: string;
}

const DEFAULTS: Omit<LeadModalConfig, 'id' | 'updated_at'> = {
  step1_title: 'Entre para o Radar das Ofertas',
  step1_description: 'Preencha seus dados para receber as melhores promoções.',
  step2_title: 'O que te interessa?',
  step2_description: 'Escolha uma opção e selecione categorias se quiser.',
  options: [
    { label: '📋 Lista das 10 melhores ofertas do mês', type: 'top10_ofertas', visible: true },
    { label: '🔥 Radar das Ofertas', type: 'radar_ofertas', visible: true },
    { label: '🎟️ Cupom exclusivo', type: 'cupom_exclusivo', visible: true },
    { label: '⚡ Alerta de promoção relâmpago', type: 'alerta_promo', visible: true },
  ],
  tags: ['Roupas', 'Eletrônicos', 'Ferramentas', 'Casa e Decoração', 'Beleza e Saúde', 'Esportes', 'Outros'],
  whatsapp_group_link: 'https://chat.whatsapp.com/GRUPO_PLACEHOLDER',
  whatsapp_number: '5515981184423',
};

export function useLeadModalConfig() {
  return useQuery({
    queryKey: ['lead-modal-config'],
    queryFn: async (): Promise<LeadModalConfig> => {
      const { data, error } = await (supabase.from('lead_modal_config') as any)
        .select('*')
        .eq('id', 'default')
        .single();
      if (error || !data) return { id: 'default', ...DEFAULTS, updated_at: '' };
      return data as LeadModalConfig;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateLeadModalConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Omit<LeadModalConfig, 'id' | 'updated_at'>>) => {
      const { error } = await (supabase.from('lead_modal_config') as any)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', 'default');
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lead-modal-config'] }),
  });
}

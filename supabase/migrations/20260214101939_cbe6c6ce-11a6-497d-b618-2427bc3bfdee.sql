
CREATE TABLE public.lead_modal_config (
  id TEXT NOT NULL DEFAULT 'default' PRIMARY KEY,
  step1_title TEXT NOT NULL DEFAULT 'Entre para o Radar das Ofertas',
  step1_description TEXT NOT NULL DEFAULT 'Preencha seus dados para receber as melhores promoções.',
  step2_title TEXT NOT NULL DEFAULT 'O que te interessa?',
  step2_description TEXT NOT NULL DEFAULT 'Escolha uma opção e selecione categorias se quiser.',
  options JSONB NOT NULL DEFAULT '[{"label":"📋 Lista das 10 melhores ofertas do mês","type":"top10_ofertas"},{"label":"🔥 Radar das Ofertas","type":"radar_ofertas"},{"label":"🎟️ Cupom exclusivo","type":"cupom_exclusivo"},{"label":"⚡ Alerta de promoção relâmpago","type":"alerta_promo"}]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT ARRAY['Roupas','Eletrônicos','Ferramentas','Casa e Decoração','Beleza e Saúde','Esportes','Outros'],
  whatsapp_group_link TEXT NOT NULL DEFAULT 'https://chat.whatsapp.com/GRUPO_PLACEHOLDER',
  whatsapp_number TEXT NOT NULL DEFAULT '5515981184423',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_modal_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read config" ON public.lead_modal_config FOR SELECT USING (true);
CREATE POLICY "Admins can update config" ON public.lead_modal_config FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert config" ON public.lead_modal_config FOR INSERT WITH CHECK (is_admin());

INSERT INTO public.lead_modal_config (id) VALUES ('default');

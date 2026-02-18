ALTER TABLE public.lead_modal_config
ADD COLUMN hero_subtitle text NOT NULL DEFAULT 'Seu radar de ofertas ativo 24h',
ADD COLUMN hero_title text NOT NULL DEFAULT 'Radar das Ofertas',
ADD COLUMN hero_description text NOT NULL DEFAULT 'Rastreamos os menores precos dos maiores marketplaces do Brasil para voce. Economize ate 70% em milhares de produtos.',
ADD COLUMN hero_tags jsonb NOT NULL DEFAULT '["📡 Preços Rastreados","💰 Até 70% OFF","🏪 Maiores Marketplaces"]',
ADD COLUMN hero_banner_url text NOT NULL DEFAULT '';
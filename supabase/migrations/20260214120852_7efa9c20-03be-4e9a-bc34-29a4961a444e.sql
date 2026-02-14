
ALTER TABLE public.lead_modal_config 
ADD COLUMN badges jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.lead_modal_config SET badges = '[
  {"text": "🔥 OFERTA RELÂMPAGO", "active": true},
  {"text": "💥 SUPER DESCONTO", "active": true},
  {"text": "🚨 PROMOÇÃO ATIVA", "active": true},
  {"text": "💰 PREÇO BAIXOU", "active": true},
  {"text": "⚡ IMPERDÍVEL", "active": true},
  {"text": "🏷️ ATÉ 70% OFF", "active": true},
  {"text": "📉 MENOR PREÇO", "active": true},
  {"text": "⏳ ÚLTIMAS UNIDADES", "active": true},
  {"text": "🚨 POR TEMPO LIMITADO", "active": true},
  {"text": "⌛ ACABA HOJE", "active": true},
  {"text": "🔥 SÓ HOJE", "active": true},
  {"text": "⚡ CORRE QUE ACABA", "active": true}
]'::jsonb WHERE id = 'default';

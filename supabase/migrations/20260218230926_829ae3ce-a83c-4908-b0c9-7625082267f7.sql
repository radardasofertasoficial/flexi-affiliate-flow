ALTER TABLE public.lead_modal_config
ADD COLUMN whatsapp_button_text text NOT NULL DEFAULT 'Perguntar no WhatsApp',
ADD COLUMN whatsapp_card_link text NOT NULL DEFAULT '';
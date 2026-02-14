ALTER TABLE public.lead_modal_config
ADD COLUMN meta_pixel_id text NOT NULL DEFAULT '',
ADD COLUMN ga4_measurement_id text NOT NULL DEFAULT '';
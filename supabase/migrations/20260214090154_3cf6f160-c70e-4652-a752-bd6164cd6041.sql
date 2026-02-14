
-- Create leads table to store WhatsApp lead captures
CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_target text NOT NULL DEFAULT '5515981184423',
  lead_type text NOT NULL,
  message text NOT NULL,
  source text NOT NULL DEFAULT 'whatsapp_float',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert leads (public capture)
CREATE POLICY "Anyone can submit leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view leads"
ON public.leads
FOR SELECT
USING (is_admin());

-- Only admins can delete leads
CREATE POLICY "Admins can delete leads"
ON public.leads
FOR DELETE
USING (is_admin());

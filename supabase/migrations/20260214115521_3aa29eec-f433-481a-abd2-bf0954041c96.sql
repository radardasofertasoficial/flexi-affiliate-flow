
-- Create platforms table
CREATE TABLE public.platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view platforms"
ON public.platforms FOR SELECT
USING (true);

-- Admin manage
CREATE POLICY "Admins can manage platforms"
ON public.platforms FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Insert initial platforms
INSERT INTO public.platforms (name, slug) VALUES
  ('Shopee', 'shopee'),
  ('Mercado Livre', 'mercadolivre');

-- Create storage bucket for platform logos
INSERT INTO storage.buckets (id, name, public) VALUES ('platform-logos', 'platform-logos', true);

-- Public read policy for platform logos
CREATE POLICY "Platform logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'platform-logos');

-- Admin upload policy
CREATE POLICY "Admins can upload platform logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'platform-logos' AND public.is_admin());

-- Admin update policy
CREATE POLICY "Admins can update platform logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'platform-logos' AND public.is_admin());

-- Admin delete policy
CREATE POLICY "Admins can delete platform logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'platform-logos' AND public.is_admin());

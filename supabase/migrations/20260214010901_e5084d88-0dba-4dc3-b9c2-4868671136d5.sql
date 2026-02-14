
-- Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (is_admin()) WITH CHECK (is_admin());

-- Seed with existing categories
INSERT INTO public.categories (name) VALUES
  ('Eletrônicos'), ('Casa & Decoração'), ('Moda'), ('Beleza'),
  ('Esportes'), ('Brinquedos'), ('Automotivo'), ('Outros');

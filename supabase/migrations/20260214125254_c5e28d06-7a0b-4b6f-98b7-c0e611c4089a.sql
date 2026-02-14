ALTER TABLE public.products
ADD COLUMN sales_count integer DEFAULT 0,
ADD COLUMN show_sales boolean DEFAULT false;
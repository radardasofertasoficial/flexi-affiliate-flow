
-- Drop broken restrictive policies
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

-- Recreate as PERMISSIVE (default)
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
USING (active = true);

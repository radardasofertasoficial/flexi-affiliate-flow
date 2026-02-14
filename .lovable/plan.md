

## Upload de Imagem + Visitas na Vitrine + Simplificar WhatsApp

### Resumo das mudanças

1. **Upload de imagem do computador** — no formulário de produto, além do campo "URL da Imagem", haverá um botão para subir arquivo (JPG, JPEG, PNG) do computador. O arquivo será armazenado no storage e a URL gerada será usada como imagem do produto.

2. **Vitrine: trocar um botão WhatsApp por contador de visitas** — dos dois botões WhatsApp ("Vale a pena?" e "Perguntar"), manter apenas um ("Perguntar no WhatsApp"). No lugar do segundo, exibir um contador de visitas/cliques (ex: "👁 1.234 visitas").

3. **Novo campo: Visitas (views_count)** — novo campo no banco e no formulário admin para definir um número inicial de visitas. Com toggle para decidir se mostra ou não na vitrine.

---

### Detalhes técnicos

**Migração SQL:**
```sql
ALTER TABLE public.products
ADD COLUMN views_count integer DEFAULT 0,
ADD COLUMN show_views boolean DEFAULT false;
```

**Storage — bucket para imagens de produtos:**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND public.is_admin());
```

**Tipos (`src/types/database.ts`):**
- Adicionar `views_count: number` e `show_views: boolean` ao `Product`
- Adicionar `views_count?: number` e `show_views?: boolean` ao `ProductInsert`

**Admin (`src/pages/admin/AdminProducts.tsx`):**
- No campo de imagem, adicionar botão "Enviar arquivo" ao lado do input de URL
- Aceitar `.jpg, .jpeg, .png`
- Ao fazer upload, enviar para o bucket `product-images` e preencher o campo `image` com a URL pública
- Novos campos: "Visitas" (number) e toggle "Mostrar visitas"
- Atualizar `emptyProduct` e `openEdit` com os novos campos

**Vitrine (`src/components/ProductCard.tsx`):**
- Remover o botão "Vale a pena?" (WhatsApp)
- Transformar a área de 2 botões em: 1 botão WhatsApp "Perguntar" (largura total) + exibição de visitas
- Exibir "👁 X visitas" quando `show_views === true` e `views_count > 0`

**Arquivos alterados:**
- Nova migração SQL (storage bucket + colunas)
- `src/types/database.ts` — novos campos
- `src/pages/admin/AdminProducts.tsx` — upload de imagem + campos de visitas
- `src/components/ProductCard.tsx` — simplificar botões + exibir visitas

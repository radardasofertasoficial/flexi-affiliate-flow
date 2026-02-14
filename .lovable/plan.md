
## Auto-preenchimento de Produto via Link da Plataforma

### O que muda

Ao criar um novo produto, voce tera um campo extra **"Link do Produto (plataforma)"** no topo do formulario. Ao colar o link da Shopee (ou qualquer outra plataforma) e clicar em "Buscar dados", o sistema vai automaticamente preencher:

- Titulo
- Descricao
- Imagem principal
- Preco atual
- Preco original (se disponivel)
- Quantidade vendida (novo campo!)

Voce ainda preenche o **Link de Afiliado** manualmente -- esse e o link que redireciona os visitantes.

### Novo campo: Quantidade Vendida

- Adicionar coluna `sales_count` na tabela `products` (numero inteiro, padrao 0)
- Adicionar um toggle **"Mostrar vendidos"** (`show_sales`) na tabela (booleano, padrao false)
- Na vitrine (ProductCard), exibir algo como "1.234 vendidos" apenas quando o toggle estiver ativo
- No admin, voce pode editar manualmente ou deixar o valor que veio do scraping

### Fluxo no formulario

```text
+--------------------------------------------------+
| Link do Produto (plataforma)                     |
| [https://shopee.com.br/produto-xyz...]  [Buscar] |
+--------------------------------------------------+
       |  (carregando...)
       v
  Preenche automaticamente:
  - Titulo
  - Descricao  
  - Imagem
  - Preco / Preco original
  - Quantidade vendida
+--------------------------------------------------+
| Link de Afiliado *  (preenchimento manual)        |
| [https://shope.ee/aff123...]                      |
+--------------------------------------------------+
```

Todos os campos preenchidos automaticamente podem ser editados antes de salvar.

### Detalhes tecnicos

**Migracao SQL:**
```sql
ALTER TABLE public.products
ADD COLUMN sales_count integer DEFAULT 0,
ADD COLUMN show_sales boolean DEFAULT false;
```

**Edge function `firecrawl-scrape`:**
- Ja existe e ja extrai titulo, descricao, imagem e preco
- Sera atualizada para tambem extrair quantidade vendida do markdown (ex: regex para "X vendidos", "X mil vendidos", padrao Shopee)
- Tambem tentar extrair o preco original (riscado) para calcular desconto

**Tipos (`src/types/database.ts`):**
- Adicionar `sales_count` e `show_sales` ao `Product` e `ProductInsert`

**Admin (`src/pages/admin/AdminProducts.tsx`):**
- Novo campo "Link do Produto" + botao "Buscar dados" no dialog de criacao/edicao
- Estado de loading enquanto busca
- Ao receber dados, preencher os campos do formulario automaticamente
- Campos editaveis de `sales_count` e toggle `show_sales`

**Vitrine (`src/components/ProductCard.tsx`):**
- Exibir "X vendidos" ao lado do rating/reviews, quando `show_sales` for true e `sales_count > 0`

**Arquivos alterados:**
- `supabase/functions/firecrawl-scrape/index.ts` -- melhorar extracao (vendidos, preco original)
- `src/types/database.ts` -- novos campos
- `src/pages/admin/AdminProducts.tsx` -- campo de busca + novos campos no form
- `src/components/ProductCard.tsx` -- exibir vendidos

## Melhorar a Pagina de Relatorios

### O que vai mudar

A pagina de relatorios sera reestruturada com as seguintes secoes, de cima para baixo:

**1. Cabecalho com Filtro de Data**

- Seletor de periodo com data inicial e data final (usando DatePicker com calendario)
- Inicia mostrando o dia de hoje como padrao
- Botao para aplicar o filtro

**2. Cards de Resumo (ja existentes)**

- Total de Cliques (filtrado pelo periodo)
- Produtos com Cliques
- Media por Produto
- mais clicado

**3. Categoria Mais Clicada**

- Card destacado mostrando qual categoria teve mais cliques no periodo selecionado, com o numero de cliques

**4. Top 5 Mais Clicados**

- Secao com cards ou lista destacada dos 5 produtos mais clicados
- Cada item mostra: miniatura da imagem do produto, titulo, categoria e numero de cliques

**5. Demais Produtos Clicados**

- Tabela com todos os outros produtos que tiveram cliques (a partir do 6o)
- Cada linha mostra: miniatura da imagem, titulo, categoria e cliques

### Detalhes Tecnicos

**Arquivo: `src/pages/admin/AdminReports.tsx**` (reescrita completa)

- Adicionar estados `dateFrom` e `dateTo` para o filtro de periodo
- Usar componente DatePicker (Popover + Calendar do shadcn) para selecao de datas
- Alterar a query do `product_clicks` para filtrar por `clicked_at` entre as datas selecionadas:
  ```
  .gte('clicked_at', dateFrom)
  .lte('clicked_at', dateTo)
  ```
- Buscar produtos com `id, title, image, category` (em vez de apenas `id, title`)
- Agrupar cliques por categoria para calcular a categoria mais clicada
- Separar o array de resultados em `top5` (primeiros 5) e `rest` (demais)
- Renderizar imagens com tamanho `w-10 h-10 rounded object-cover` (mesmo estilo da tabela de produtos)

**Componentes utilizados (ja disponiveis no projeto):**

- `Calendar` de `@/components/ui/calendar`
- `Popover` / `PopoverTrigger` / `PopoverContent` de `@/components/ui/popover`
- `Button` de `@/components/ui/button`
- `format` de `date-fns` para formatar datas
- Icones do `lucide-react`

Nenhuma migracao de banco e necessaria -- os dados de imagem e categoria ja existem na tabela `products`.
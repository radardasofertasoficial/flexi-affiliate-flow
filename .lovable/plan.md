## Filtros Completos na Aba de Produtos: Plataforma, Datas e Valor

### O que muda

Adicionar tres novos filtros na area de filtros da aba de produtos, funcionando em conjunto com os filtros de categoria e busca ja existentes:

1. **Filtro por plataforma (loja)** -- botoes "Todas", "Shopee", "Mercado Livre"
2. **Filtro por data de cadastro** -- dois seletores de data ("De" e "Ate")

sempre começar mostrando os ultimos cadastros, ou seja, deixar selecionado os ultimos 7 dias

1. **Filtro por faixa de preco** -- dois campos numericos ("Preco min" e "Preco max") ou ordenar por maior valor para o menor e vice versa

### Detalhes tecnicos

**Arquivo: `src/pages/admin/AdminProducts.tsx**`

1. **Novos estados**:
  - `selectedStore: string` (default `'Todas'`)
  - `dateFrom: Date | undefined`
  - `dateTo: Date | undefined`
  - `priceMin: string` (default `''`)
  - `priceMax: string` (default `''`)
2. **Atualizar `filteredProducts**` para incluir todos os filtros:
  ```
   const filteredProducts = products.filter(p => {
     const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
     const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
     const matchStore = selectedStore === 'Todas' || p.store === selectedStore;
     const matchDateFrom = !dateFrom || new Date(p.created_at) >= startOfDay(dateFrom);
     const matchDateTo = !dateTo || new Date(p.created_at) <= endOfDay(dateTo);
     const matchPriceMin = !priceMin || Number(p.price) >= parseFloat(priceMin);
     const matchPriceMax = !priceMax || Number(p.price) <= parseFloat(priceMax);
     return matchCategory && matchSearch && matchStore && matchDateFrom && matchDateTo && matchPriceMin && matchPriceMax;
   });
  ```
3. **UI dos filtros** -- adicionar na area de filtros existente:
  - **Plataforma**: botoes horizontais logo abaixo da barra de categorias, mesmo estilo (ativo com `bg-cta`). Mapeamento: "Shopee" filtra por `'shopee'`, "Mercado Livre" filtra por `'mercadolivre'`
  - **Datas**: dois `Popover` com `Calendar` ("De" e "Ate") na linha do campo de busca, usando `format(date, "dd/MM/yyyy")` e locale `ptBR`
  - **Preco**: dois `Input` tipo number com placeholder "Min" e "Max", com prefixo "R$", na mesma linha das datas
  - **Botao limpar**: um botao "Limpar filtros" que reseta datas, preco e plataforma de uma vez (aparece apenas quando algum desses filtros estiver ativo)
4. **Imports adicionais**:
  - `Calendar` de `@/components/ui/calendar`
  - `Popover, PopoverContent, PopoverTrigger` de `@/components/ui/popover`
  - `CalendarIcon, X` de `lucide-react`
  - `startOfDay, endOfDay, format` de `date-fns`
  - `ptBR` de `date-fns/locale`

Nenhuma migracao de banco necessaria -- os campos `created_at`, `store` e `price` ja existem na tabela de produtos.
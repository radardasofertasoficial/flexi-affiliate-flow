

## Filtros na Aba de Produtos: Categorias e Busca

### O que muda

1. **Barra de categorias** no topo da listagem -- botoes com "Todos" + cada categoria cadastrada. Ao clicar, filtra a tabela para mostrar apenas produtos daquela categoria.

2. **Campo de busca** -- um input de texto para pesquisar produtos pelo nome. Filtra em tempo real conforme o usuario digita.

Ambos os filtros funcionam em conjunto: se o usuario selecionar uma categoria e digitar uma busca, so aparecem produtos que atendem aos dois criterios.

### Detalhes tecnicos

**Arquivo: `src/pages/admin/AdminProducts.tsx`**

1. **Novos estados**:
   - `selectedCategory: string` (default `'Todos'`)
   - `searchQuery: string` (default `''`)

2. **UI dos filtros** -- inserir entre o cabecalho (h1 + botao "Novo Produto") e a tabela:
   - Barra de categorias: botoes horizontais com scroll, usando as categorias ja carregadas (`categories`), prefixadas com "Todos". Estilo similar ao `CategoryBar` da vitrine (botao ativo com `bg-cta`, demais com `bg-secondary`).
   - Campo de busca: `Input` com icone de lupa (`Search` do lucide) e placeholder "Buscar produto...".

3. **Filtragem derivada** -- criar `filteredProducts` a partir de `products`:
   ```
   const filteredProducts = products.filter(p => {
     const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
     const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
     return matchCategory && matchSearch;
   });
   ```
   Usar `filteredProducts` no lugar de `products` na renderizacao da tabela.

4. **Contador** -- exibir quantidade de produtos filtrados (ex: "12 produtos" ou "3 de 45 produtos") para dar feedback visual ao usuario.

Nenhuma migracao de banco necessaria -- todos os dados ja estao disponiveis.

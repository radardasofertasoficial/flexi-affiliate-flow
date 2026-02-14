

## Adicionar Valor do Produto no Relatorio

### O que muda

Exibir o preco (R$) dos produtos em duas secoes do relatorio:

1. **Top 5 Mais Clicados** -- adicionar o preco abaixo da categoria em cada card
2. **Tabela "Demais Produtos"** -- adicionar uma coluna "Preco" na tabela

### Detalhes tecnicos

**Arquivo: `src/pages/admin/AdminReports.tsx`**

O campo `price` ja esta sendo buscado na query e ja existe na interface `ClickReport`, entao so precisa exibir nos dois lugares:

1. **Top 5 cards (linha ~230)** -- adicionar `R$ {r.price.toFixed(2)}` abaixo da categoria, com estilo discreto (`text-xs text-muted-foreground`)

2. **Tabela de demais produtos**:
   - Adicionar coluna "Preco" no `thead` (entre "Categoria" e "Cliques")
   - Adicionar celula com `R$ {r.price.toFixed(2)}` no `tbody`

Nenhuma migracao ou alteracao de query necessaria.


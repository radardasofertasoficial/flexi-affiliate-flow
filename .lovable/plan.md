

## Restaurar campos de Avaliação e Reviews + Badge padrão

### O que muda

1. **Campos de Nota e Reviews voltam ao formulário de produto** — dois campos numéricos no dialog de criação/edição:
   - **Nota (rating)**: campo numérico de 0 a 5, com step 0.1
   - **Avaliações (reviews)**: campo numérico inteiro

2. **Badge sempre com valor padrão** — ao abrir o formulário de novo produto, o badge já vem selecionado com a primeira opção ativa da lista de badges configurados. Nunca fica "Sem badge".

### Detalhes técnicos

**Arquivo: `src/pages/admin/AdminProducts.tsx`**

- Atualizar `emptyProduct` para incluir `rating: 0` e `reviews: 0`
- Mudar a lógica de inicialização do badge: ao abrir "Novo Produto", definir `badge` como o texto do primeiro badge ativo (da lista de `activeBadges`), em vez de string vazia
- Adicionar dois campos no grid do formulário (dialog):
  - "Nota" — `<Input type="number" step="0.1" min="0" max="5" />`
  - "Avaliações" — `<Input type="number" min="0" />`
- No `openEdit`, garantir que `rating` e `reviews` são mapeados do produto existente

**Nenhuma mudança de banco de dados necessária** — os campos `rating` e `reviews` já existem na tabela `products`.

## Simplificar Formulario de Produto e Pre-cadastrar Badges

### O que muda

1. **Remover campo "Prioridade"** do formulario -- esse campo controla a ordem de exibicao dos produtos na vitrine (numero maior aparece primeiro). Como nao e intuitivo, vamos remove-lo do formulario e deixar o valor padrao 0. A ordenacao sera feita pela data de cadastro.
2. **Remover campo "N Reviews"** do formulario -- esse campo e apenas decorativo (exibe "X avaliações" no card). Nao faz sentido preencher manualmente. Vai sair do formulario e ficar com valor padrao 0.
3. **Remover campo "Avaliacao"** do formulario -- mesmo motivo, e decorativo. Valor padrao 0.
4. **Badge pre-cadastrado nas Configuracoes** -- em vez de digitar "emoji + texto" manualmente, os badges serao cadastrados na aba de Configuracoes (similar as tags). No formulario de produto, o campo badge vira um `select` com as opcoes pre-cadastradas + opcao "Nenhum".

### Detalhes tecnicos

**Banco de dados:**

- Adicionar um campo `badges` (array de texto) na tabela `lead_modal_config` para armazenar os badges pre-cadastrados. Exemplos iniciais: "Mais Vendido", "Oferta Relampago", "Menor Preco".

**Arquivo: `src/pages/admin/AdminSettings.tsx**`

- Adicionar um novo Card "Badges de Produto" com a mesma mecanica das tags: lista dos badges cadastrados, campo para adicionar novo, botao de excluir cada um.

**Arquivo: `src/hooks/useLeadModalConfig.ts**`

- Adicionar `badges: string[]` na interface `LeadModalConfig` e nos defaults.

**Arquivo: `src/pages/admin/AdminProducts.tsx**`

- Remover campos: Prioridade, N Reviews, Avaliacao.
- Trocar campo Badge de `Input` para `select` que lista os badges cadastrados na config, com opcao "Sem badge".
- Manter os campos: Link Afiliado, Titulo, Descricao, Preco, Preco Original, URL Imagem, Categoria, Plataforma, Destaque, Ativo.

seguem os badges abaixo para deixar cadastrados, e com campo de check para deixar ativo, editar ou apagar tambem

- 🔥 OFERTA RELÂMPAGO
- 💥 SUPER DESCONTO
- 🚨 PROMOÇÃO ATIVA
- 💰 PREÇO BAIXOU
- ⚡ IMPERDÍVEL
- 🏷️ ATÉ 70% OFF
- 📉 MENOR PREÇO

- ⏳ ÚLTIMAS UNIDADES
- 🚨 POR TEMPO LIMITADO
- ⌛ ACABA HOJE
- 🔥 SÓ HOJE
- ⚡ CORRE QUE ACABA


## Gestao de Plataformas e Logos na Tabela de Produtos

### Resumo

Criar um sistema completo de cadastro de plataformas (Shopee, Mercado Livre, Magalu, etc.) nas configuracoes do admin, com nome, slug, logo e status ativo/inativo. Na tabela de produtos, substituir o texto da loja pelo logotipo da plataforma e reorganizar as colunas.

---

### 1. Nova tabela `platforms` no banco de dados

Campos:
- `id` (uuid, PK)
- `name` (text) -- ex: "Shopee", "Mercado Livre", "Magalu"
- `slug` (text, unique) -- ex: "shopee", "mercadolivre", "magalu"
- `logo_url` (text, nullable) -- URL do logotipo
- `active` (boolean, default true) -- se aparece na vitrine
- `created_at` (timestamp)

Politicas RLS: leitura publica, gerenciamento apenas para admins.

### 2. Storage bucket para logos

Criar um bucket `platform-logos` publico para armazenar os logotipos que voce subir.

### 3. Aba "Plataformas" nas Configuracoes

Dentro da pagina de Configuracoes (`AdminSettings.tsx`), adicionar um novo Card com:
- Lista das plataformas cadastradas, cada uma mostrando: logo (miniatura), nome, slug, switch ativo/inativo, botoes editar e excluir
- Botao "Nova Plataforma" que abre um formulario com: nome, slug (gerado automaticamente a partir do nome), campo para URL do logo (com opcao de upload), e switch ativo/inativo
- Botao salvar/atualizar por plataforma

### 4. Tabela de produtos -- reorganizacao de colunas

Nova ordem das colunas:
1. **Plataforma** -- exibe o logotipo da plataforma (imagem pequena ~24px) ao inves do texto. Se nao tiver logo, mostra o nome como fallback
2. **Produto** -- titulo + imagem miniatura (como ja esta, mas sem o texto da loja embaixo)
3. **Categoria**
4. **Preco**
5. **Status**
6. **Acoes**

### 5. Filtro de plataforma atualizado

Os botoes de filtro por plataforma no admin passam a ser gerados dinamicamente a partir da tabela `platforms`, mostrando o logo + nome de cada plataforma ao inves de texto fixo.

### 6. Formulario de produto atualizado

O select de "Loja" no formulario de criacao/edicao de produto passa a listar as plataformas cadastradas na tabela `platforms` (apenas as ativas), ao inves de opcoes fixas.

### 7. Vitrine publica

O `ProductCard` na vitrine mostra o logo da plataforma (quando disponivel) ao inves do badge de texto.

---

### Detalhes tecnicos

**Migracao SQL:**
- Criar tabela `platforms` com RLS
- Criar bucket `platform-logos` publico
- Inserir registros iniciais para "Shopee" (slug: shopee) e "Mercado Livre" (slug: mercadolivre) para manter compatibilidade com os dados existentes

**Arquivos a alterar:**
- `src/pages/admin/AdminSettings.tsx` -- adicionar secao de plataformas com CRUD completo
- `src/pages/admin/AdminProducts.tsx` -- reorganizar colunas da tabela, usar logos, gerar filtros dinamicamente, atualizar select do formulario
- `src/components/ProductCard.tsx` -- exibir logo da plataforma ao inves de texto

**Novo arquivo:**
- `src/hooks/usePlatforms.ts` -- hook para buscar plataformas do banco (com cache via React Query)

**Fluxo de upload de logo:**
Voce sobe a imagem pelo chat, eu configuro a URL no campo `logo_url` da plataforma. Alternativamente, o formulario de plataforma tera um campo de URL onde voce pode colar o link direto da imagem.


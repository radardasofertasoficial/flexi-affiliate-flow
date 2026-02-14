
## Etiquetas de Interesse nos Leads (Segmentacao por Categoria)

Vamos adicionar um passo de selecao de categorias de interesse antes de redirecionar o visitante para o WhatsApp. Isso permite segmentar os leads por tipo de produto que a pessoa quer receber promocao.

### Como vai funcionar para o visitante

Tanto no pop-up quanto no botao flutuante, apos clicar em uma opcao (ex: "Cupom exclusivo"), aparece uma segunda tela rapida com etiquetas clicaveis:

- Roupas
- Eletronicos
- Ferramentas
- Casa e Decoracao
- Beleza e Saude
- Esportes
- Outros

A pessoa seleciona uma ou mais categorias (multi-selecao com chips/badges), clica em "Enviar pelo WhatsApp" e a mensagem ja vai personalizada, por exemplo:
> "Quero meu cupom exclusivo! Interesses: Roupas, Eletronicos"

### O que muda no banco de dados

- Nova coluna `tags` (tipo `text[]`, array de texto) na tabela `leads` para guardar as categorias selecionadas
- Valor padrao: array vazio `'{}'`

### O que muda no painel admin

- Nova coluna "Etiquetas" na tabela de leads mostrando badges coloridos
- Filtro por etiqueta no topo da pagina
- Etiquetas incluidas no export CSV/Excel
- Card de resumo mostrando as etiquetas mais populares

### Detalhes tecnicos

**Banco de dados:**
- Migration: `ALTER TABLE public.leads ADD COLUMN tags text[] NOT NULL DEFAULT '{}';`

**Componentes atualizados:**
- `src/components/LeadCapturePopup.tsx` - Adicionar estado de "step 2" com selecao de categorias antes de abrir o WhatsApp
- `src/components/WhatsAppFloat.tsx` - Mesma logica de selecao de categorias no card expandido
- `src/pages/admin/AdminLeads.tsx` - Mostrar coluna de etiquetas, filtro por etiqueta, incluir no CSV

**Fluxo em 2 passos:**
1. Visitante clica na isca digital (ex: "Cupom exclusivo")
2. Aparece selecao de categorias com chips toggleaveis
3. Clica "Enviar" -> salva lead com tags no banco -> abre WhatsApp com mensagem personalizada

**Lista de categorias (gerenciada no codigo inicialmente):**
```
const interestTags = [
  'Roupas', 'Eletronicos', 'Ferramentas',
  'Casa e Decoracao', 'Beleza e Saude', 'Esportes', 'Outros'
];
```

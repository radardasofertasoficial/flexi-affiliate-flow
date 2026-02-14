# Landing Page "Como Funciona" - Radar das Ofertas

## Resumo

Criar uma nova pagina dedicada `/como-funciona` com 6 secoes altamente persuasivas, seguindo o briefing completo. O botao "Como Funciona" no header sera atualizado para apontar para essa rota.

---

## Estrutura

### 1. Nova rota e pagina

- Criar `src/pages/ComoFunciona.tsx` com todas as 6 secoes
- Adicionar rota `/como-funciona` no `App.tsx`
- Atualizar link no `SiteHeader.tsx` de `href="#"` para `href="/como-funciona"`

### 2. Secoes da pagina

**Secao 1 - Hero**

- Fundo azul escuro (#0D1B2A) com graficos decorativos de radar (CSS/SVG)
- Titulo: "Onde as melhores ofertas aparecem primeiro."
- Subtitulo: "Entre para o Radar e pare de pagar mais caro."
- Botao amarelo (#FFC300) grande: "QUERO ENTRAR PARA O RADAR"
- Texto abaixo: "Gratis - Sem spam - Apenas ofertas reais"

**Secao 2 - Problema**

- Fundo branco
- Titulo: "Voce ja perdeu uma oferta por chegar atrasado?"
- 4 itens com icones Lucide (AlertTriangle, Clock, TrendingUp, Package)
- Texto final em destaque

**Secao 3 - Como Funciona**

- 3 colunas com icones e numeracao
- Monitoramos 24h / Descontos reais / Compre direto
- Texto: "Simples. Rapido. Sem custo."

**Secao 4 - Categorias**

- Grid responsivo com 7 categorias (icones + nome)
- Eletronicos, Casa, Infantil, Moda, Mercado, Games, Beleza
- Texto: "Se existe desconto real, a gente encontra."

**Secao 5 - Urgencia**

- Fundo escuro (#0D1B2A) com destaque amarelo (#FFC300)
- Titulo: "As melhores ofertas duram poucos minutos."

**Secao 6 - CTA Final**

- Titulo: "Pare de perder dinheiro."
- Botao amarelo grande: "QUERO RECEBER AS OFERTAS AGORA"

### 3. Conversao (botoes CTA)

- Todos os botoes CTA abrirao o modal de captura de lead existente (`LeadCapturePopup`) com formulario nome + WhatsApp e as etiquetas de categorias
- Reutilizar a logica de lead ja existente (inserir na tabela `leads` + redirecionar para WhatsApp)

### 4. Botao fixo flutuante no mobile

- Barra fixa no rodape mobile com botao "QUERO ENTRAR PARA O RADAR" (amarelo)
- Visivel apenas em telas pequenas (`md:hidden`)
- Aciona o mesmo fluxo de lead capture

### 5. Estilo visual

- Cores customizadas inline: azul escuro `#0D1B2A`, amarelo `#FFC300`, branco
- Fonte bold usando `font-display` (Space Grotesk) ja configurada
- Animacoes de fade-up nos elementos ao scroll
- Hover com scale nos botoes
- Scroll suave (`scroll-smooth` no container)
- Espacamento generoso entre secoes
- Mobile-first e totalmente responsivo

---

## Detalhes tecnicos

### Arquivos modificados

- `src/App.tsx` - adicionar rota `/como-funciona`
- `src/components/SiteHeader.tsx` - atualizar link "Como Funciona"

### Arquivos criados

- `src/pages/ComoFunciona.tsx` - pagina completa com todas as 6 secoes, botao fixo mobile e logica de conversao

### Dependencias

- Nenhuma nova dependencia necessaria
- Lucide icons para icones das secoes
- Componentes UI existentes (Dialog, Button)
- Integracao com tabela `leads` ja existente para captura
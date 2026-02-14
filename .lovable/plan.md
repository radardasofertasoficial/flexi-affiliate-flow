

## Instalar Pixel do Meta + Google Analytics (GA4) com Eventos de Rastreamento

### Resumo

Adicionar os scripts do Meta Pixel e Google Analytics 4 ao site, criar eventos padronizados (PageView, Click CTA, Lead), e preparar para criacao automatica de publicos. O modal obrigatorio antes da oferta ja existe -- vamos apenas adicionar os disparos de eventos nele.

---

### Passo 1 -- Voce cria as contas (antes de eu implementar)

**Meta Pixel:**
1. Acesse [business.facebook.com](https://business.facebook.com)
2. Va em "Eventos" > "Conectar fontes de dados" > "Web" > "Pixel da Meta"
3. Crie o pixel e copie o **Pixel ID** (numero com ~15 digitos, ex: `123456789012345`)

**Google Analytics 4:**
1. Acesse [analytics.google.com](https://analytics.google.com)
2. Crie uma propriedade GA4
3. Va em "Administracao" > "Fluxos de dados" > "Web" > Adicione o dominio do seu site
4. Copie o **Measurement ID** (formato `G-XXXXXXXXXX`)

Depois de criar, cole os dois IDs aqui no chat.

---

### Passo 2 -- Configuracao no Admin (dinamica)

Adicionar dois campos nas Configuracoes do admin para que voce possa inserir/alterar os IDs sem precisar mexer no codigo:

- Campo **Meta Pixel ID** (na secao de configuracoes)
- Campo **GA4 Measurement ID** (na secao de configuracoes)

Esses valores serao salvos na tabela `lead_modal_config` (reaproveitando a config existente) com os campos `meta_pixel_id` e `ga4_measurement_id`.

---

### Passo 3 -- Scripts de rastreamento

Criar um componente `TrackingScripts` que:
- Carrega o script do Meta Pixel (`fbq`) com o Pixel ID configurado
- Carrega o script do Google Analytics (`gtag`) com o Measurement ID configurado
- Dispara automaticamente o evento **PageView** ao carregar qualquer pagina
- Dispara novamente **PageView** em cada mudanca de rota (SPA)

O componente sera adicionado ao `App.tsx`.

---

### Passo 4 -- Eventos personalizados

Criar um utilitario `src/lib/tracking.ts` com funcoes reutilizaveis:

| Evento | Quando dispara | Meta Pixel | GA4 |
|---|---|---|---|
| **PageView** | Cada pagina carregada | `fbq('track', 'PageView')` | `gtag('event', 'page_view')` |
| **ClickCTA** | Clique no botao "Ver Oferta" | `fbq('trackCustom', 'ClickCTA', {...})` | `gtag('event', 'click_cta', {...})` |
| **Lead** | Lead salvo com sucesso no modal | `fbq('track', 'Lead', {...})` | `gtag('event', 'generate_lead', {...})` |

Parametros enviados nos eventos:
- `ClickCTA`: nome do produto, loja, categoria, preco
- `Lead`: nome, tipo de interesse, tags selecionadas, source

---

### Passo 5 -- Integrar eventos nos componentes

**`ProductCard.tsx`** -- Disparar `ClickCTA` ao clicar em "Ver Oferta"

**`LeadCaptureModal.tsx`** -- Disparar `Lead` ao concluir o cadastro com sucesso

**`TrackingScripts.tsx`** -- Disparar `PageView` automaticamente em cada navegacao

---

### Passo 6 -- Publicos automaticos

Com os eventos configurados, voce podera criar publicos automaticamente nos paineis do Meta e Google:

- **Meta Ads Manager**: "Publicos" > "Publico Personalizado" > "Site" > selecionar eventos (PageView, ClickCTA, Lead)
- **Google Analytics**: "Administracao" > "Publicos" > criar com base nos eventos (ex: "Usuarios que clicaram CTA nos ultimos 7 dias")

A criacao de publicos e feita diretamente nas plataformas Meta/Google, nao no codigo. Os eventos que vamos disparar sao exatamente os que as plataformas usam para criar esses publicos.

---

### Detalhes tecnicos

**Migracao SQL:**
- Adicionar campos `meta_pixel_id` (text) e `ga4_measurement_id` (text) na tabela `lead_modal_config`

**Novos arquivos:**
- `src/lib/tracking.ts` -- funcoes `trackPageView()`, `trackClickCTA(product)`, `trackLead(data)`
- `src/components/TrackingScripts.tsx` -- componente que injeta os scripts e rastreia pageviews

**Arquivos alterados:**
- `src/hooks/useLeadModalConfig.ts` -- adicionar campos pixel/ga4 na interface
- `src/pages/admin/AdminSettings.tsx` -- adicionar secao "Rastreamento" com campos para os IDs
- `src/App.tsx` -- adicionar `TrackingScripts` dentro do `BrowserRouter`
- `src/components/ProductCard.tsx` -- chamar `trackClickCTA` no clique
- `src/components/LeadCaptureModal.tsx` -- chamar `trackLead` no submit com sucesso

**Modal obrigatorio:**
Ja esta implementado. O lead e obrigatorio antes de ver a oferta, entao o evento Lead sempre dispara antes do ClickCTA -- perfeito para o funil de conversao.


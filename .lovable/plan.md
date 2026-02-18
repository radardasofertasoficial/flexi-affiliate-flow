

## Banner Editavel nas Configuracoes

### O que muda

1. **Textos do banner editaveis linha a linha** -- as 3 linhas de texto do banner (subtitulo, titulo, descricao) passam a ser configurados na aba de Configuracoes do admin, em vez de fixos no codigo.

2. **Botoes/tags do banner editaveis** -- os 3 chips ("Precos Rastreados", "Ate 70% OFF", "Maiores Marketplaces") passam a ser uma lista editavel, onde voce pode adicionar, remover e editar cada um.

3. **Imagem de fundo do banner** -- nova opcao para fazer upload de uma imagem do computador (JPG, JPEG, PNG). Apos o upload, a imagem aparece como preview para confirmar. O tamanho recomendado sera exibido (1920x600px).

---

### Detalhes tecnicos

**Migracao SQL -- novos campos na tabela `lead_modal_config`:**
```text
ALTER TABLE public.lead_modal_config
ADD COLUMN hero_subtitle text NOT NULL DEFAULT 'Seu radar de ofertas ativo 24h',
ADD COLUMN hero_title text NOT NULL DEFAULT 'Radar das Ofertas',
ADD COLUMN hero_description text NOT NULL DEFAULT 'Rastreamos os menores precos dos maiores marketplaces do Brasil para voce. Economize ate 70% em milhares de produtos.',
ADD COLUMN hero_tags jsonb NOT NULL DEFAULT '["📡 Precos Rastreados","💰 Ate 70% OFF","🏪 Maiores Marketplaces"]',
ADD COLUMN hero_banner_url text NOT NULL DEFAULT '';
```

**Hook (`src/hooks/useLeadModalConfig.ts`):**
- Adicionar os 5 novos campos na interface `LeadModalConfig` e nos `DEFAULTS`

**Admin Settings (`src/pages/admin/AdminSettings.tsx`):**
- Nova secao "Banner da Pagina Inicial" com:
  - Input "Subtitulo" (linha pequena acima do titulo)
  - Input "Titulo" (titulo grande)
  - Textarea "Descricao" (paragrafo abaixo do titulo)
  - Lista editavel de tags/chips (adicionar, remover, editar -- igual ao modelo de badges)
  - Upload de imagem de fundo com preview e indicacao de tamanho recomendado (1920x600px)
  - Upload usa o bucket `product-images` ja existente

**HeroSection (`src/components/HeroSection.tsx`):**
- Importar `useLeadModalConfig` para consumir os textos e imagem dinamicos
- Substituir textos hardcoded pelos valores do config
- Substituir import estatico da imagem pela URL do config (com fallback para a imagem atual)
- Renderizar a lista de tags do config em vez do array fixo

**Arquivos alterados:**
- Nova migracao SQL (5 colunas)
- `src/hooks/useLeadModalConfig.ts` -- novos campos
- `src/pages/admin/AdminSettings.tsx` -- nova secao "Banner"
- `src/components/HeroSection.tsx` -- textos e imagem dinamicos


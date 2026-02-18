

## Botao WhatsApp Editavel na Vitrine

### O que muda

1. **Texto do botao WhatsApp no card** -- o texto "Perguntar no WhatsApp" passa a ser editavel nas Configuracoes.
2. **Link do botao WhatsApp no card** -- ao inves de usar numero hardcoded, usa um link configuravel (canal, grupo, ou wa.me). Se vazio, usa wa.me + numero ja cadastrado como fallback.
3. **Secao WhatsApp nas Configuracoes** -- ganha dois novos campos: texto do botao e link do botao da vitrine.

---

### Detalhes tecnicos

**Migracao SQL -- 2 novas colunas na tabela `lead_modal_config`:**

```text
ALTER TABLE public.lead_modal_config
ADD COLUMN whatsapp_button_text text NOT NULL DEFAULT 'Perguntar no WhatsApp',
ADD COLUMN whatsapp_card_link text NOT NULL DEFAULT '';
```

**Hook (`src/hooks/useLeadModalConfig.ts`):**
- Adicionar `whatsapp_button_text` e `whatsapp_card_link` na interface `LeadModalConfig` e nos `DEFAULTS`

**Admin Settings (`src/pages/admin/AdminSettings.tsx`):**
- Na secao "WhatsApp" (ja existente), adicionar 2 novos campos:
  - "Texto do botao WhatsApp (vitrine)" -- input de texto
  - "Link do botao WhatsApp (vitrine)" -- input de texto, com dica de que se vazio usa wa.me + numero
- Incluir os dois novos campos no `handleSave` e no `useEffect` de inicializacao

**ProductCard (`src/components/ProductCard.tsx`):**
- Importar `useLeadModalConfig`
- Usar `config.whatsapp_button_text` no texto do botao verde
- No `handleWhatsApp`, usar `config.whatsapp_card_link` se preenchido; senao montar `wa.me/{config.whatsapp_number}?text=...`
- Remover numero hardcoded `5515981184423`

**Arquivos alterados:**
- Nova migracao SQL (2 colunas)
- `src/hooks/useLeadModalConfig.ts`
- `src/pages/admin/AdminSettings.tsx`
- `src/components/ProductCard.tsx`


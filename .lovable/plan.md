

## Adicionar Toggle de Visibilidade nas Opções de Interesse

### Objetivo
Adicionar um botão de ativar/desativar (switch) em cada opção de interesse na aba de Configurações, permitindo esconder ou mostrar opções sem precisar apagá-las.

### Mudanças

**1. Atualizar a interface `LeadOption`** (`src/hooks/useLeadModalConfig.ts`)
- Adicionar campo `visible: boolean` (padrão `true`) ao tipo `LeadOption`.
- Atualizar os valores padrão (DEFAULTS) para incluir `visible: true` em cada opção.

**2. Atualizar o Admin Settings** (`src/pages/admin/AdminSettings.tsx`)
- Adicionar um componente Switch ao lado de cada opção de interesse.
- Opções desativadas ficarao com visual mais apagado (opacidade reduzida) para indicar que estao ocultas.

**3. Filtrar opções no Modal** (`src/components/LeadCaptureModal.tsx`)
- No Step 2, filtrar as opções para mostrar apenas as que possuem `visible: true` (ou `visible` indefinido, para compatibilidade com dados antigos).

### Detalhes Tecnicos

- O campo `visible` sera armazenado dentro do JSONB `options` na tabela `lead_modal_config`, portanto nao precisa de migração SQL.
- Opções existentes sem o campo `visible` serao tratadas como visíveis por padrão.
- O Switch usara o componente `@radix-ui/react-switch` ja disponível no projeto.


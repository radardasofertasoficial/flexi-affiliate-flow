

# Reformulacao Completa da Captura de Leads

## Problema Atual
Os leads salvos no banco nao tem nome nem telefone -- apenas o tipo de mensagem e tags de interesse. Isso torna os dados inuteis para contato direto.

## O que muda

### 1. Adicionar colunas `name` e `phone` na tabela `leads`
- Migration para adicionar `name TEXT` e `phone TEXT` na tabela `leads`
- Ambas obrigatorias (NOT NULL) com default vazio para nao quebrar registros antigos

### 2. Novo fluxo do modal de captura (todos os pontos de entrada)
O modal sera reformulado em todos os lugares onde aparece:
- `LeadCapturePopup.tsx` (popup de 15 segundos)
- `WhatsAppFloat.tsx` (botao flutuante)
- `ComoFunciona.tsx` (pagina como funciona)
- `ProductCard.tsx` (botoes "Vale a pena?" e "Perguntar")

**Novo fluxo em 2 etapas:**

```text
Etapa 1: Formulario obrigatorio
+----------------------------------+
|  Entre para o Radar das Ofertas  |
|                                  |
|  Nome: [___________________]     |
|  WhatsApp: [_______________]     |
|                                  |
|  [CONTINUAR]                     |
+----------------------------------+

Etapa 2: Escolha de interesse + categorias
+----------------------------------+
|  O que te interessa?             |
|                                  |
|  [Opcao 1] [Opcao 2] [Opcao 3]  |
|  [Tag1] [Tag2] [Tag3] [Tag4]    |
|                                  |
|  [ENTRAR NO RADAR]              |
+----------------------------------+

Resultado: Salva lead com nome + telefone no banco
           -> Redireciona para link do grupo WhatsApp
```

### 3. Componente reutilizavel
Criar `src/components/LeadCaptureModal.tsx` -- um unico componente de modal reutilizavel que sera usado em todos os pontos de entrada. Isso elimina a duplicacao de codigo entre os 4 arquivos.

### 4. Validacao dos campos
- Nome: minimo 2 caracteres, obrigatorio
- WhatsApp: formato brasileiro (apenas numeros, 10-11 digitos), obrigatorio
- Mascara de input no campo WhatsApp: `(99) 99999-9999`

### 5. Redirecionamento apos cadastro
- Apos salvar o lead, redirecionar para o link do grupo WhatsApp
- Link placeholder configuravel: `https://chat.whatsapp.com/GRUPO_PLACEHOLDER`
- Facil de trocar depois em uma unica constante

### 6. Bloqueio de oferta no ProductCard
- O botao "Ver Oferta" so libera o link de afiliado APOS o usuario preencher o cadastro
- Se ja cadastrou (verificar via localStorage), libera direto
- Se nao cadastrou, abre o modal obrigatorio primeiro

---

## Detalhes tecnicos

### Migration SQL
```sql
ALTER TABLE leads ADD COLUMN name TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN phone TEXT NOT NULL DEFAULT '';
```

### Arquivos criados
- `src/components/LeadCaptureModal.tsx` -- componente unico e reutilizavel

### Arquivos modificados
- `src/components/LeadCapturePopup.tsx` -- usar o novo LeadCaptureModal
- `src/components/WhatsAppFloat.tsx` -- usar o novo LeadCaptureModal
- `src/pages/ComoFunciona.tsx` -- usar o novo LeadCaptureModal
- `src/components/ProductCard.tsx` -- bloquear "Ver Oferta" ate cadastro, usar LeadCaptureModal

### Persistencia local
- Apos cadastro bem-sucedido, salvar flag `lead_registered=true` no localStorage
- Isso evita pedir cadastro repetido ao mesmo visitante


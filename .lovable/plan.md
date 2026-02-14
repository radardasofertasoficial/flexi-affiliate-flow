## Isca Digital + Pop-up Estratégico de Captura de Leads

Vamos implementar dois mecanismos de captura de leads que trabalham juntos para maximizar conversão.

### 1. Pop-up Estratégico (após 15 segundos)

Um modal que aparece automaticamente após 15 segundos de navegação, com visual impactante:

- Icone de raio + titulo "Antes de sair!"
- Subtitulo: "Quer receber as melhores promocoes no WhatsApp?"
- Quatro opcoes de isca digital como botoes:
  - "Lista das 10 melhores ofertas do mes"
  - "Guia de compra inteligente"
  - "Cupom exclusivo"
  - "Alerta de promocao relampago"
- Cada botao abre o WhatsApp com mensagem pre-preenchida correspondente
- Botao de fechar (X) e opcao "Nao, obrigado"
- Salva no `localStorage` que o usuario ja viu, para nao mostrar novamente na mesma sessao

### 2. Atualizacao do Botao Flutuante

O `WhatsAppFloat` existente sera atualizado para incluir as mesmas iscas digitais no card expandido, substituindo as opcoes atuais por:

- "Lista das 10 melhores ofertas"
- "Entre para Radas das Ofertas" 
- "Cupom exclusivo"
- "Alerta de promocao relampago"

### Detalhes tecnicos

**Arquivos envolvidos:**

- `src/components/LeadCapturePopup.tsx` (novo) - Modal com timer de 15s e iscas digitais
- `src/components/WhatsAppFloat.tsx` (atualizado) - Novas opcoes de isca no card
- `src/App.tsx` (atualizado) - Incluir o novo componente LeadCapturePopup
- `tailwind.config.ts` (atualizado) - Adicionar animacao `fade-up` e `pulse-badge` se necessario

**Logica do pop-up:**

- `useEffect` com `setTimeout` de 15 segundos
- Verificacao de `localStorage` para nao repetir na sessao
- Exibido apenas na pagina publica (nao no admin)
- Usa o componente Dialog do shadcn/ui para o modal

**Sem dependencias novas** - tudo com React, Tailwind e componentes existentes.

Todos os leads, eu quero que esteja no painel do admin, para eu visualizar depois, e exportar, deixar guardado no banco de dados, mas que eu consiga, exporta para um excel
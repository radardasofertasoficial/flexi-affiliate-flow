

## Botão Flutuante de Captura de Leads via WhatsApp

Vamos transformar o botão simples do WhatsApp em um componente de captura de leads mais completo e persuasivo, com duas opções de ação para o visitante.

### O que vai mudar

O ícone redondo atual será substituído por um componente expandível:

- **Estado fechado**: Ícone do WhatsApp com um badge pulsante (indicando novidade/atenção)
- **Estado aberto (ao clicar)**: Um card flutuante com duas opções:
  1. **"Receba ofertas exclusivas no WhatsApp"** - Abre conversa com mensagem pré-definida tipo "Quero receber ofertas exclusivas!"
  2. **"Peça recomendação personalizada"** - Abre conversa com mensagem "Quero uma recomendação personalizada de produto!"
- **Botão de fechar** para recolher o card

### Detalhes visuais

- Card com fundo escuro (seguindo o tema do site) e bordas arredondadas
- Título "Fale conosco no WhatsApp" no topo do card
- Cada opção será um botão verde do WhatsApp com texto claro
- Animação suave de entrada/saída do card
- Badge pulsante vermelho no ícone para chamar atenção

### Detalhes técnicos

- Arquivo modificado: `src/components/WhatsAppFloat.tsx`
- Uso de estado React (`useState`) para controlar aberto/fechado
- Links `wa.me` com parâmetro `text=` para mensagens pré-preenchidas
- Animações via classes Tailwind CSS
- Nenhuma dependência nova necessária

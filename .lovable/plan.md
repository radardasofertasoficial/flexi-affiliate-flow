## Tornar Selecao de Interesses Obrigatoria no Cadastro de Leads

### O que muda

No segundo passo do modal de captura de leads (`LeadCaptureModal`), o usuario sera **obrigado** a:

1. Selecionar uma **opcao principal** (ja existe, mas sem feedback visual de erro)
2. Selecionar **pelo menos uma tag de interesse** (atualmente opcional)

consegue colocar uma informação que fica em destaque, pulsando, apaga e acende, sei lá ? algo assim ?

Sem preencher ambos, o botao "ENTRAR NO RADAR" ficara desabilitado e uma mensagem de validacao aparecera orientando o usuario.

### Detalhes tecnicos

**Arquivo: `src/components/LeadCaptureModal.tsx**`

1. **Desabilitar botao de submit** -- alterar a condicao `disabled` do botao final de:
  ```
   disabled={!selectedOption || submitting}
  ```
   para:
2. **Mensagens de validacao** -- adicionar textos de orientacao:
  - Abaixo das opcoes principais: "Selecione uma opcao" (aparece apenas se o usuario tentar submeter sem selecionar)
  - Abaixo das tags: "Selecione pelo menos um interesse" (aparece se nenhuma tag estiver marcada)
  - Usar estilo `text-xs text-destructive` consistente com os erros do passo 1
3. **Feedback visual sutil** -- as mensagens aparecem de forma permanente enquanto nada estiver selecionado (sem necessidade de estado extra de "tentou submeter"), servindo como guia claro para o usuario.

Nenhuma migracao de banco necessaria.
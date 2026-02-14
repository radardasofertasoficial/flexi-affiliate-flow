
## Corrigir fluxo do modal: redirecionar automaticamente apos cadastro

### Problema
Quando o usuario clica em "ENTRAR NO RADAR" no modal, a funcao `handleSubmit` chama `onOpenChange(false)` primeiro. Isso dispara o callback do ProductCard que limpa o `pendingAction` para `null`. Quando `onSuccess` e chamado logo depois, o `pendingAction` ja esta vazio e nenhuma acao acontece -- o usuario fica preso sem ser redirecionado.

### Solucao
Inverter a ordem no `handleSubmit`: chamar `onSuccess` **antes** de fechar o modal com `onOpenChange(false)`. Assim a acao pendente (abrir a oferta, enviar WhatsApp) executa primeiro enquanto o `pendingAction` ainda existe, e so depois o modal fecha.

### Mudancas

**Arquivo: `src/components/LeadCaptureModal.tsx`** (linhas 76-80)

Alterar a ordem de:
```
localStorage.setItem(LEAD_REGISTERED_KEY, 'true');
setSubmitting(false);
onOpenChange(false);
resetState();
if (onSuccess) { onSuccess(); } else { ... }
```

Para:
```
localStorage.setItem(LEAD_REGISTERED_KEY, 'true');
setSubmitting(false);
if (onSuccess) { onSuccess(); } else { window.open(whatsappLink, '_blank', 'noopener,noreferrer'); }
onOpenChange(false);
resetState();
```

Isso garante que a acao de redirecionamento executa antes do modal fechar e antes do `pendingAction` ser limpo.

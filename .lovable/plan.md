

## Botoes de Conversa Qualificada nos Produtos

Adicionar dois novos botoes em cada card de produto para iniciar conversas personalizadas no WhatsApp, aumentando o engajamento qualificado.

### O que muda para o visitante

Cada card de produto tera 3 botoes:

1. **"Ver Oferta"** (existente) - redireciona para o link de afiliado
2. **"Quero saber se vale a pena"** - abre WhatsApp com mensagem: `"Ola! Vi o produto [NOME] no site e quero saber se vale a pena."`
3. **"Perguntar no WhatsApp"** - abre WhatsApp com mensagem: `"Ola! Vi o produto [NOME] no site e quero mais informacoes."`

Os novos botoes terao estilo verde WhatsApp, menores que o botao principal, dispostos lado a lado abaixo do "Ver Oferta".

### O que muda no banco de dados

Cada clique nos novos botoes sera salvo na tabela `leads` com:
- `lead_type`: `"produto_vale_pena"` ou `"produto_pergunta"`
- `message`: a mensagem personalizada com o nome do produto
- `source`: `"product_card"`
- `tags`: array vazio (sem selecao de categorias nesse fluxo)

### Detalhes tecnicos

**Arquivo editado:**
- `src/components/ProductCard.tsx` - Adicionar os dois botoes abaixo do "Ver Oferta", cada um abrindo `wa.me/5515981184423` com mensagem pre-preenchida e registrando o lead no banco

**Layout dos botoes:**
- "Ver Oferta" continua como botao principal (laranja/CTA, largura total)
- Abaixo, dois botoes menores lado a lado em verde WhatsApp (#25D366)
- Icone do WhatsApp em cada botao
- Texto responsivo que se adapta ao espaco disponivel


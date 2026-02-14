

## Melhorias no Relatorio: Produtos sem cliques, Filtro e Links para Anuncios

### Resumo das mudancas

**1. Incluir produtos sem cliques no relatorio**
- Atualmente so aparecem produtos que tiveram cliques. A query sera ajustada para tambem trazer todos os produtos ativos que nao receberam nenhum clique no periodo (cliques = 0).
- Isso permite identificar produtos "parados" na vitrine para decidir se vale manter ou remover.

**2. Filtro "Com cliques / Sem cliques / Todos"**
- Tres botoes (ou tabs) no topo da area de listagem: **Todos** (padrao), **Com cliques**, **Sem cliques**
- Ao iniciar, mostra todos. O usuario pode alternar para ver apenas os que nao estao performando.

**3. Clicar na imagem do produto abre o anuncio na plataforma**
- Ao clicar na foto (tanto no Top 5 quanto na tabela de demais produtos), abre uma nova aba com o `affiliate_url` do produto, direcionando para o anuncio na Shopee/Mercado Livre.
- Para isso, o campo `affiliate_url` sera incluido na query de produtos.

### Detalhes tecnicos

**Arquivo: `src/pages/admin/AdminReports.tsx`**

1. **Interface ClickReport** -- adicionar campo `affiliate_url: string`

2. **Query de produtos** (linha 44) -- incluir `affiliate_url`:
   ```
   .select('id, title, image, category, affiliate_url')
   ```

3. **Logica de montagem do report** -- alem de montar rows a partir dos cliques, tambem incluir produtos que nao tiveram nenhum clique no periodo:
   ```
   // Depois de montar as rows com cliques, adicionar produtos sem cliques
   products.forEach(p => {
     if (!clickCount[p.id]) {
       rows.push({
         product_id: p.id,
         title: p.title,
         image: p.image,
         category: p.category,
         affiliate_url: p.affiliate_url,
         clicks: 0,
       });
     }
   });
   ```

4. **Novo estado** `clickFilter`:
   ```
   const [clickFilter, setClickFilter] = useState<'all' | 'with' | 'without'>('all');
   ```

5. **Filtragem derivada** -- antes de separar em top5/rest, aplicar o filtro:
   ```
   const filteredReport = report.filter(r => {
     if (clickFilter === 'with') return r.clicks > 0;
     if (clickFilter === 'without') return r.clicks === 0;
     return true;
   });
   ```

6. **UI do filtro** -- 3 botoes logo acima da secao Top 5 / tabela:
   - "Todos" / "Com cliques" / "Sem cliques"
   - O botao ativo recebe estilo `variant="default"`, os outros `variant="outline"`

7. **Imagens clicaveis** -- envolver as imagens em tags `<a>`:
   ```
   <a href={r.affiliate_url} target="_blank" rel="noopener noreferrer">
     <img src={r.image} ... className="... cursor-pointer hover:opacity-80 transition" />
   </a>
   ```
   Isso se aplica tanto nos cards do Top 5 (linha ~200) quanto nas linhas da tabela (linha ~233).

8. **Cards de resumo** -- ajustar o card "Produtos com Cliques" para tambem mostrar o total de produtos (com e sem cliques), algo como "12 de 45 produtos".

9. **Secao "Sem cliques"** -- quando o filtro estiver em "Sem cliques", a secao Top 5 nao aparece (nao faz sentido rankear por 0 cliques). Mostra apenas a tabela com todos os produtos sem cliques, facilitando a limpeza da vitrine.

Nenhuma migracao de banco necessaria -- o campo `affiliate_url` ja existe na tabela `products`.

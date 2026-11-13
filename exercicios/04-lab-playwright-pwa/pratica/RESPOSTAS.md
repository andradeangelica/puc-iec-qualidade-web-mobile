# RESPOSTAS — Lab Playwright PWA

> Preencha **depois** de fazer os desafios (≈ 10 min). Respostas **curtas e suas** (3 a 6 linhas cada).
> Não precisa de texto bonito — precisa mostrar que você **entendeu o porquê**, não só o como.
> Vale 1 ponto (correção manual, no Canvas).

**Nome:** Angélica Alves Andrade
**Login do GitHub:** andradeangelica
**Usei IA?** ( ) não · (X) sim — qual ferramenta e pra quê: Claude (Anthropic), para escrever os testes dos Blocos A–F e da missão livre, rodá-los e rascunhar estas respostas; depois eu li o código e revisei o texto. *(usar é permitido; esconder não)*

---

### 1. Por que `await expect(locator).toHaveCount(12)` é melhor que `expect(await locator.count()).toBe(12)`?
*(Dica: o que cada um faz se a lista ainda estiver carregando? Pense no Bloco B e no F.)*

O `toHaveCount` é uma asserção com auto-espera: o Playwright repete a checagem até o número chegar a 12 ou estourar o timeout. Já o `count()` lê o número **uma única vez**, como uma foto: se a lista ainda está carregando, ele devolve 0 ou um valor parcial e o teste falha (ou passa por sorte, se a rede estiver rápida). Foi esse o defeito do F1a e do F1b: o resultado dependia de quanto a rede demorava naquela execução.

### 2. Por que o Bloco C desliga o Service Worker (`serviceWorkers: 'block'`) e o Bloco E mantém ligado?
*(Dica: o que o SW faz com o `fetch` do catálogo? E o que o teste offline precisa do SW?)*

Com o SW ligado, ele responde ao `fetch` do catálogo direto do cache, então a requisição nunca chega ao `page.route()` e o mock não tem efeito. No Bloco C eu preciso controlar o "backend", por isso bloqueio o SW. No Bloco E o objetivo é provar a PWA: sem SW controlando a página não existe cache para servir o app offline (o reload offline falharia com `ERR_INTERNET_DISCONNECTED`), então ele precisa ficar ligado.

### 3. No D3 você semeou favoritos pelo `localStorage` em vez de clicar nos corações. Qual o ganho? Qual o risco? Cite **um caso em que você NÃO semearia**.
*(Dica: o que o clique prova que a semente não prova?)*

O ganho é velocidade e menos fragilidade: o teste de favoritos não depende de a tela de catálogo estar funcionando, e cada falha aponta para um só motivo. O risco é semear um estado que o app nunca geraria sozinho (id inexistente, formato errado) e o teste passar sem provar nada sobre o uso real. Eu **não** semearia no teste que verifica o próprio ato de favoritar e persistir (como o B3), porque o clique é justamente o que está sendo testado.

### 4. Bloco F: quais eram os defeitos dos testes instáveis (F1a, F1b e F1d) e como você **provou** que ficaram estáveis?
*(Cite os comandos que rodou e o resultado.)*

F1a e F1b liam o número uma vez (`count()`), e o F1b ainda usava um sleep fixo (`waitForTimeout`) torcendo para o carregamento terminar; troquei por `await expect(...).toHaveCount(n)`. O F1d supunha que o F1c já tinha favoritado o Matrix, mas cada teste nasce com navegador zerado; agora ele mesmo favorita o Matrix antes de conferir. Rodei `npx playwright test 06-flaky --repeat-each=10` (41 passaram, contando o setup) e `npx playwright test 06-flaky -g "F1d"` (passou sozinho). A suíte completa também passou 3 vezes seguidas (25 de 25 em cada rodada).

### 5. Seus mocks do Bloco C (C1–C4) dão confiança em quê — e **que bug real passaria batido** mesmo com todos eles verdes?
*(Dica: o que muda quando o backend é de verdade? Pense em contrato, formato, lentidão.)*

Eles dão confiança de que a **interface** reage corretamente a respostas que eu controlo: lista com poucos itens, erro 500 com recuperação pelo "Tentar de novo", dado real alterado e o debounce disparando uma só requisição. Passaria batido um backend real que mude o contrato (um campo como `vote_average` vindo nulo ou como texto, que quebraria a tela), lentidão ou timeout (o mock responde instantaneamente) e um cache antigo do Service Worker servindo dado desatualizado, já que nesses testes o SW está bloqueado.

### 6. Missão livre: por que você escolheu **esse** fluxo? Que risco do produto ele cobre? O que ficou **sem** teste e por quê?

Escolhi os comentários do detalhe do filme porque é o único fluxo em que o usuário **escreve** dados que o app guarda (IndexedDB com fila offline), e os blocos A–F só o tocaram pelo lado offline (E4). O risco coberto é aceitar entrada inválida ou perder o que o usuário digitou: testei o caminho feliz (autor, texto e selo "synced"), o vazio/só espaços (botão desabilitado e Enter não cria nada) e o limite de 280 caracteres. Ficou sem teste que o comentário é salvo sem espaços nas pontas e que os comentários de um filme não aparecem em outro; deixei de fora por tempo, e o primeiro é o próximo que eu adicionaria.

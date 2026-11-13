# RESPOSTAS --- Lab Playwright PWA

**Nome:** Angélica Alves Andrade\
**Login do GitHub:** andradeangelica

**Usei IA?** ( ) não · (X) sim --- qual ferramenta e pra quê: Claude
(Anthropic), para escrever os testes dos Blocos A--F e da missão livre,
rodá-los e rascunhar estas respostas; depois eu li o código e revisei o
texto.

------------------------------------------------------------------------

### 1. Por que `await expect(locator).toHaveCount(12)` é melhor que `expect(await locator.count()).toBe(12)`?

O `toHaveCount` possui uma espera automática, repetindo a verificação
até que o número de elementos esperado seja encontrado ou o tempo limite
seja atingido. Já o `count()` verifica a quantidade de elementos apenas
uma vez. Se a lista ainda estiver carregando, pode retornar zero ou uma
quantidade parcial, fazendo o teste falhar. Esse foi o problema
identificado nos testes F1a e F1b, que dependiam do tempo de
carregamento da página.

### 2. Por que o Bloco C desliga o Service Worker (`serviceWorkers: 'block'`) e o Bloco E mantém ligado?

Com o Service Worker ativo, as requisições do catálogo podem ser
respondidas diretamente pelo cache, impedindo que o `page.route()`
intercepte a chamada. No Bloco C, o objetivo é controlar as respostas do
backend por meio dos mocks, por isso o Service Worker é bloqueado. Já no
Bloco E, ele precisa permanecer ativo para que o teste consiga validar o
funcionamento offline da PWA e o carregamento dos dados armazenados em
cache.

### 3. No D3 você semeou favoritos pelo `localStorage` em vez de clicar nos corações. Qual o ganho? Qual o risco? Cite um caso em que você NÃO semearia.

A principal vantagem é tornar o teste mais rápido e independente de
outras funcionalidades da aplicação, evitando que uma falha no catálogo
interfira no teste de favoritos. Por outro lado, existe o risco de
inserir um estado que a aplicação não geraria normalmente, como um ID
inexistente ou um formato de dados incorreto. Não utilizaria essa
abordagem em um teste que verifica o próprio processo de favoritar e
salvar a informação, como o B3, pois nesse caso é importante validar a
interação do usuário.

### 4. Bloco F: quais eram os defeitos dos testes instáveis (F1a, F1b e F1d) e como você provou que ficaram estáveis?

Os testes F1a e F1b verificavam a quantidade de elementos apenas uma vez
usando `count()`. Além disso, o F1b utilizava um tempo de espera fixo
(`waitForTimeout`), que não garantia que o carregamento tivesse
terminado. Substituí essas verificações por
`await expect(...).toHaveCount(n)`, que possui espera automática.

O F1d dependia de um favorito criado pelo teste F1c, mas cada teste é
executado de forma independente. Para corrigir, incluí a ação de
favoritar o Matrix no próprio F1d.

Para validar as correções, executei:

-   `npx playwright test 06-flaky --repeat-each=10`: 41 testes passaram,
    incluindo o setup.
-   `npx playwright test 06-flaky -g "F1d"`: o teste passou executado
    isoladamente.
-   Suíte completa: 25 de 25 testes passaram em três execuções
    consecutivas.

### 5. Seus mocks do Bloco C (C1--C4) dão confiança em quê --- e que bug real passaria batido mesmo com todos eles verdes?

Os mocks dão confiança de que a interface responde corretamente a
diferentes situações controladas, como retorno de poucos itens, erro 500
com recuperação pelo botão "Tentar de novo", alteração de dados e
funcionamento do debounce, evitando requisições desnecessárias.

Porém, os testes não garantem que o backend real esteja funcionando
corretamente. Uma alteração no contrato da API, como um campo que passe
a retornar nulo ou em um formato diferente do esperado, poderia causar
problemas na aplicação. Também não são validados problemas de lentidão,
timeout ou dados desatualizados fornecidos pelo cache do Service Worker,
que está bloqueado nesses testes.

### 6. Missão livre: por que você escolheu esse fluxo? Que risco do produto ele cobre? O que ficou sem teste e por quê?

Escolhi testar o fluxo de comentários na tela de detalhes do filme
porque envolve a entrada de informações pelo usuário e o armazenamento
desses dados no IndexedDB, inclusive com suporte à fila offline. É um
fluxo importante para garantir que as informações digitadas não sejam
perdidas.

Os testes cobriram o preenchimento e envio de um comentário válido, a
exibição do selo "synced", a validação de campos vazios ou preenchidos
apenas com espaços e o limite de 280 caracteres.

Não validei se os espaços no início e no final do comentário são
removidos antes do salvamento, nem se os comentários ficam corretamente
associados a cada filme. Esses cenários ficaram de fora nesta etapa, mas
seriam importantes para complementar a cobertura dos testes.

# Lab Mobile — Maestro Avançado (10 pts)

**Disciplina:** Qualidade em Aplicações Web e Mobile
**Aula:** Aula 5 — Maestro Avançado + Arquitetura de Testes
**Entrega:** fork + Pull Request no repositório da disciplina (**ver Canvas**)
**Valor:** 10 pontos

## Contexto

Teste que funciona mas ninguém consegue manter é dívida. Neste lab você pega os **flows Maestro** do **CineFav** (o mesmo app da Aula 4, já instalado no emulador) e **organiza**: separa *o que testar* de *como achar o elemento*, e **reaproveita em vez de copiar**.

São **5 níveis** de dificuldade crescente: fragmento, fragmento parametrizado (`env`), Page Object (`runScript`/`output`) e um flow que compõe tudo. O Nível 1 é feito **junto com o professor, antes do intervalo** (dá pra acompanhar sem emulador: é só YAML); o resto, em aula e em casa.

## Antes de começar

```bash
cd exercicios/05-lab-arquitetura-testes/pratica

# Confirme que está no lugar certo
ls flows
maestro test flows/01-smoke.yaml     # modelo resolvido — emulador ligado, deve passar
```

> Windows: `dir flows`. Abra a pasta `pratica/` direto no editor (`code .`). **Não precisa de `npm`.** Você não mexe no app — só nos flows.

## O que você entrega

| Nível | Arquivo(s) | O que fazer |
|---|---|---|
| 1 | `flows/00-refatorar.yaml`, `flows/_fragments/favoritar.yaml` | **refatorar** um flow cheio de "cheiros": login vira fragmento e "favoritar" vira fragmento com `env` |
| 2 | `flows/_fragments/abrir-busca.yaml`, `flows/02-busca.yaml` | fragmento que reaproveita o login |
| 3 | `flows/_fragments/buscar.yaml`, `flows/03-busca-parametrizada.yaml` | fragmento com `env` chamado 2× |
| 4 🔴 | `flows/elements/*.js`, `flows/04-pom-login.yaml` | Page Object: nenhum `id` escrito no flow |
| 5 🔴🔴 | `flows/05-favoritos-composto.yaml` | flow longo compondo tudo |
| — | `RESPOSTAS.md` | 4 perguntas curtas |

📘 **MODELO** já prontos: `_fragments/login.yaml` e `flows/01-smoke.yaml`.

## Critérios de avaliação (10 pts)

| # | Critério | Pontos | Avaliação |
|---|---|---|---|
| 1 | Refatoração guiada (nível 1) | 2 | 🤖 automática (piso) |
| 2 | Fragmento `abrir-busca` + `02-busca` (nível 2) | 1,5 | 🤖 |
| 3 | Fragmento parametrizado chamado 2× (nível 3) | 1,5 | 🤖 |
| 4 | Page Object + `04-pom-login` (nível 4) | 1,5 | 🤖 |
| 5 | Flow composto `05` (nível 5) | 2 | 🤖 |
| 6 | `RESPOSTAS.md` — entendeu o porquê | 1 | 📝 manual (Canvas) |
| 7 | Execução real dos flows no Android (vídeo ou print) | 0,5 | 📝 manual (Canvas) |

**Critério eliminatório sobre o entregue:** os flows escritos devem passar 3 vezes seguidas. Nível não feito vale 0 naquele critério, não zera o lab.

## Como entregar

1. Fork + clone novo; branch própria; trabalhe em `exercicios/05-lab-arquitetura-testes/pratica/`.
2. Abra o PR — o bot (J.A.R.V.I.S.) comenta a **nota mínima automática** a cada push.
3. `RESPOSTAS.md` e a evidência no Android entram na nota final no Canvas.
4. **Fez em dupla** (por exemplo, só um de vocês tem emulador)? Escreva os **dois nomes no README** do PR e **cada um envia o link do PR no Canvas**.

## Dicas

- Leia os modelos prontos antes de escrever os seus.
- O caminho do `runFlow` é **relativo ao arquivo que chama**.
- Travou num seletor? `maestro hierarchy` lista os ids da tela atual.
- Bônus sem nota: gere um relatório JUnit (`maestro test --format junit --output relatorio.xml flows/`).

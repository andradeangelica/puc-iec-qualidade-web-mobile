# Lab Mobile — Maestro Básico + Jest (10 pts)

**Disciplina:** Qualidade em Aplicações Web e Mobile
**Aula:** Aula 4 — Maestro Mobile
**Entrega:** fork + Pull Request no repositório da disciplina
**Valor:** 10 pontos

---

## Contexto

Você recebe o **CineFav mobile** — app React Native (Expo) **já implementado**:
login, lista de filmes, busca, favoritos, detalhe, com `testID` em todos os
elementos críticos e dados mockados (roda sem token, determinístico).

Seu trabalho são os **testes**, em duas frentes:

- **Parte A — Jest/RNTL**: completar os testes unitários e de integração em
  `pratica/__tests__/` (scaffolds com TODOs; o primeiro arquivo vem resolvido).
- **Parte B — Maestro E2E**: completar os flows **02 e 03** em `pratica/flows/`
  (o flow 01 vem resolvido) e rodar em emulador iOS **e** Android.
  Os flows **04 e 05 são OPCIONAIS** (prática extra, **não valem nota**).

## Antes de começar

```bash
cd exercicios/02-lab-mobile-maestro-jest/pratica

# Confirme que está no lugar certo
ls flows __tests__
# → 01-launch.yaml ... · unit/ integration/
```

> **Windows:** `cd exercicios\02-lab-mobile-maestro-jest\pratica` e `dir flows`

```bash
npm install
npm test                # Jest roda — scaffolds passam "vazios", complete os TODOs

# Maestro: instalação por SO (macOS/Linux/Windows) no COMECE-AQUI, passo 4
maestro test flows/01-launch.yaml     # com o emulador ligado
```

> **Abra a pasta `pratica/` direto no editor** (`code .`) — senão o TS server e a
> extensão Jest não acham o projeto aninhado.

## O que você entrega

1. **`__tests__/unit/02-authStore.test.ts`** — 5 testes completos.
2. **`__tests__/integration/01-login-favoritar.test.tsx`** — testes 2 e 3 completos.
3. **`flows/02-search.yaml` e `flows/03-favorite.yaml`** — TODOs completos.
   *(Opcional, sem nota: `04-detail.yaml` e `05-js-dynamic.yaml`.)*
4. **Vídeo curto** (Loom/YouTube unlisted) — `maestro test flows/02-search.yaml` e `flows/03-favorite.yaml` rodando em
   emulador Android **e** iOS Simulator (quem não tem Mac: só Android, avise no PR).
5. **CI verde no fork** — workflow de Jest já fornecido; habilite o Actions.

## Critérios de avaliação (10 pts)

| # | Critério | Pontos |
|---|----------|--------|
| 1 | Testes unitários Jest completos e passando (02-authStore, 5 testes) | 2,5 |
| 2 | Teste de integração RNTL completo (navegação + estado real) | 2,5 |
| 3 | Flows Maestro **02 e 03** completos (sem TODOs, com asserções) — 1 pt cada | 2 |
| 4 | Execução real em Android Emulator (vídeo) | 0,5 |
| 5 | Execução real em iOS Simulator (vídeo) | 0,5 |
| 6 | CI verde no fork (Jest no GitHub Actions) | 2 |

**Critério eliminatório:** flakiness > 10% em 3 runs consecutivos = -3 pts.

## Como entregar

1. Fork do repositório da disciplina → trabalhe em `exercicios/02-lab-mobile-maestro-jest/pratica/`.
2. Abra o PR — o bot corretor comenta a **nota parcial automática** a cada push.
3. Vídeos e execução real entram na nota final no Canvas.

## Dica de fluxo

- Jest primeiro (feedback em segundos), Maestro depois (precisa de emulador).
- `01-favoritesStore.test.ts` e o teste 1 da integração são seus modelos — leia antes.
- Travou num seletor Maestro? O app **Maestro Studio** (studio.maestro.dev) ou o comando `maestro hierarchy` mostram os testIDs.

➡️ **Instalação, setup do emulador e entrega passo a passo:** [`pratica/COMECE-AQUI.md`](pratica/COMECE-AQUI.md).

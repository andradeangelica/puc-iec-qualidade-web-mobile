// tests/desafios/06-flaky-cacada.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO — BLOCO F · CAÇADA AO TESTE INSTÁVEL (≈ 12 min)
//
// 🎯 Objetivo: QA bom também CONSERTA teste ruim. Esta suíte foi escrita do jeito
//    que muita gente escreve — e tem defeitos de verdade. Ache e conserte.
//
// 📚 Novo: por que `expect(await x.count())` e `waitForTimeout` são armadilhas, e
//    por que cada teste precisa nascer sozinho (cada teste recebe um navegador
//    ZERADO — nada do teste anterior sobrevive).
//    Estudar: https://playwright.dev/docs/test-retries  ·  https://playwright.dev/docs/trace-viewer-intro
//
// 🧩 Regras do conserto (o grader confere):
//    • nenhum  waitForTimeout  no arquivo
//    • nenhum  .count()  no arquivo: troque  expect(await x.count()).toBe(n)  por  await expect(x).toHaveCount(n)
//    • F1d precisa passar RODANDO SOZINHO  (dica: rode só ele,  -g "F1d",  e veja o que ele SUPÕE que já existe)
//    • não apague testes e não mude os títulos
//
// ✅ Prove que consertou — as DUAS execuções precisam ficar 100% verdes:
//      npx playwright test 06-flaky --repeat-each=10
//      npx playwright test 06-flaky -g "F1d"
//    (use também --trace on e abra o relatório pra ver o que cada teste fez:
//     npx playwright show-report)
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';

test.describe('Bloco F — suíte instável (conserte)', () => {
  test('F1a. busca mostra 1 resultado pra "matrix"', async ({ page }) => {
    await page.goto('/search');
    await page.getByTestId('search-input').pressSequentially('matrix', { delay: 40 });
    // O expect do Playwright espera o número chegar (debounce + resposta); ler o número uma vez, não.
    await expect(page.locator('[data-testid^="search-result-"]')).toHaveCount(1);
  });

  test('F1b. carregar mais traz 12 filmes novos', async ({ page }) => {
    await page.goto('/qa');
    await page.getByTestId('movielist-load-more-button').click();
    // Sem sleep: o expect espera os 24 cards aparecerem, sem depender de quanto a rede demora.
    await expect(page.getByRole('article')).toHaveCount(24);
  });

  // ✔ F1c é o CONTROLE: já está certo — compare com os outros.
  test('F1c. favoritar Matrix marca o coração', async ({ page }) => {
    await page.goto('/qa');
    await page.getByTestId('movie-card-heart-603').click();
    await expect(page.getByTestId('movie-card-heart-603')).toHaveAttribute('aria-pressed', 'true');
  });

  test('F1d. favoritos mostra 1 filme', async ({ page }) => {
    // Cada teste nasce com navegador zerado: este teste cria o PRÓPRIO estado,
    // em vez de supor que o F1c já favoritou o Matrix.
    await page.goto('/qa');
    const coracao = page.getByTestId('movie-card-heart-603');
    await coracao.click();
    await expect(coracao).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/favorites');
    await expect(page.getByTestId('favorites-count')).toHaveText('1 filme favorito');
  });
});

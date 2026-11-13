// tests/livre/missao-livre.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO (correção MANUAL) — MISSÃO LIVRE (≈ 20 min)
//
// 🎯 Aqui NÃO tem roteiro. Você é o(a) QA: escolhe o fluxo, decide o que testar e
//    justifica. É a parte que mais mostra como você pensa.
//
// 🧩 O que fazer
//   1. ESCOLHA UM fluxo do CineFav que os blocos A–F não testaram. Sugestões:
//        • remover um favorito pela tela /favorites
//        • a tela /pwa (painel "Raio-X da PWA") e seus botões
//        • logout protege as rotas (deslogado, abrir /favorites manda pro /login)
//        • comentário: vazio, muito longo (limite 280), vários comentários
//        • busca com espaços/maiúsculas ("  MATRIX ")
//        • botão Voltar do detalhe (histórico do navegador)
//      …ou um fluxo que VOCÊ achar importante. Dica: use o app de verdade 3 minutos antes!
//   2. ESCREVA 3 testes do MESMO fluxo, com nome começando por:
//        "feliz:"     o caminho normal funciona
//        "negativo:"  algo dá errado e o app reage direito
//        "borda:"     o caso limite (vazio, repetido, máximo, recarregar…)
//   3. Em pelo menos UM deles use algo que você NÃO usou nos blocos A–F — por exemplo
//      test.step · page.goBack() · .not (ex.: not.toBeVisible) · test.fail() · toHaveScreenshot.
//   4. Cada teste precisa de expect de verdade (asserção que falharia se o app quebrasse).
//   5. Responda a pergunta 6 do  RESPOSTAS.md  (por que ESSE fluxo, que risco ele cobre).
//
// 🔎 BÔNUS exploratório (vale reconhecimento): achou algo ESTRANHO no app? Escreva um
//    teste que documenta o comportamento e marque com  test.fixme()  ou  test.fail()
//    + um comentário explicando por que é suspeito. Isso é bug report em forma de código.
//
// ✅ Validar:  npx playwright test livre   → verde nos 3 testes
//
// APAGUE o teste de exemplo abaixo e escreva os seus.
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';

// Fluxo escolhido: COMENTÁRIOS no detalhe do filme (/movie/603 = Matrix).
// Por quê: é o único fluxo que ESCREVE dados do usuário (IndexedDB + fila offline) e os
// blocos A–F só tocaram nele pelo lado offline (E4). Aqui cobrimos o lado das regras de entrada.
test.describe('Missão livre — comentários no detalhe do filme', () => {
  const itens = (page: import('@playwright/test').Page) => page.locator('[data-testid^="comment-item-"]');

  test('feliz: publicar um comentário online mostra autor, texto e selo "synced"', async ({ page }) => {
    await page.goto('/movie/603');

    await test.step('antes de publicar: convite de "nenhum comentário"', async () => {
      await expect(page.getByTestId('comments-empty')).toBeVisible();
      await expect(itens(page)).toHaveCount(0);
    });

    await test.step('publica o comentário', async () => {
      await page.getByTestId('comment-input').fill('Revi ontem e continua ótimo');
      await page.getByTestId('comment-submit-button').click();
    });

    await test.step('o comentário aparece, sincroniza e o formulário é limpo', async () => {
      const comentario = itens(page).first();
      await expect(comentario).toContainText('aluno'); // autor = parte do e-mail antes do @
      await expect(comentario).toContainText('Revi ontem e continua ótimo');
      await expect(comentario.locator('[data-status]')).toHaveAttribute('data-status', 'synced');
      await expect(page.getByTestId('comments-empty')).toBeHidden();
      await expect(page.getByTestId('comment-input')).toHaveValue('');
    });
  });

  test('negativo: comentário vazio ou só com espaços não é publicado', async ({ page }) => {
    await page.goto('/movie/603');
    const campo = page.getByTestId('comment-input');
    const publicar = page.getByTestId('comment-submit-button');

    // vazio: o botão nasce desabilitado
    await expect(publicar).toBeDisabled();

    // só espaços: continua desabilitado e Enter (envio pelo teclado) não cria nada
    await campo.fill('     ');
    await expect(publicar).toBeDisabled();
    await campo.press('Enter');
    await expect(itens(page)).toHaveCount(0);
    await expect(page.getByTestId('comments-empty')).toBeVisible();

    // prova de que o bloqueio é só pela regra: com texto de verdade o botão libera
    await campo.fill('ok');
    await expect(publicar).toBeEnabled();
  });

  test('borda: o campo aceita no máximo 280 caracteres', async ({ page }) => {
    await page.goto('/movie/603');
    const campo = page.getByTestId('comment-input');
    await expect(campo).toHaveAttribute('maxlength', '280');

    // pressSequentially digita de verdade (respeita o limite); fill() ignoraria o maxlength.
    await campo.pressSequentially('a'.repeat(300));
    await expect(campo).toHaveValue('a'.repeat(280));

    await page.getByTestId('comment-submit-button').click();
    await expect(itens(page).first().locator('p')).toHaveText('a'.repeat(280));
  });
});

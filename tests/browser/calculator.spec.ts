import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("calculates, validates, resets and copies", async ({ page, context }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await expect(page.getByText("20 terremotos", { exact: true })).toBeVisible();
  await expect(page.locator(".ingredient dd")).toHaveText([
    "7 L",
    "2,4 L",
    "600 ml",
  ]);
  await page
    .getByRole("button", { name: "Aumentar personas", exact: true })
    .click();
  await expect(page.getByText("22 terremotos", { exact: true })).toBeVisible();
  await page.locator("#people").fill("3");
  await page.locator("#drinks").fill("4");
  for (const size of [300, 400, 500]) {
    await page.getByRole("radio", { name: `${size} ml` }).check();
    await expect(page.locator(".total-volume")).toHaveText(
      `${String((12 * size) / 1000).replace(".", ",")} L preparados en total`,
    );
  }
  await page.getByRole("radio", { name: "Otro" }).check();
  await expect(
    page.getByRole("button", { name: "Copiar resultado" }),
  ).toBeDisabled();
  await page.getByLabel("Tamaño personalizado").fill("735");
  await expect(page.locator(".total-volume")).toHaveText(
    "8,82 L preparados en total",
  );
  await page.getByLabel("Tamaño personalizado").fill("99");
  await expect(page.getByLabel("Tamaño personalizado")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.locator("#people").fill("");
  await expect(page.getByText("Completa las cantidades")).toBeVisible();
  await page.getByRole("button", { name: "Reiniciar" }).click();
  await expect(page.locator("#people")).toHaveValue("10");
  await expect(page.locator("#drinks")).toHaveValue("2");
  await expect(page.getByRole("radio", { name: "500 ml" })).toBeChecked();
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Copiar resultado" }).click();
  await expect(page.getByRole("status")).toHaveText("Resultado copiado");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Pipeño: 7 L",
  );
  expect(errors).toEqual([]);
});

test("responsive layout, keyboard, accessibility and metadata", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [360, 390, 430, 600, 768, 820, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    ).toBe(true);
    await expect(page.locator("#people")).toBeVisible();
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.locator("#people").focus();
  await page.keyboard.press("ArrowUp");
  await expect(page.locator("#people")).toHaveValue("11");
  await page.getByRole("radio", { name: "500 ml" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("radio", { name: "400 ml" })).toBeChecked();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page).toHaveTitle(/Calculadora de Terremoto para Fonda/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Calcula cuánto pipeño/,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".share-button")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  expect((await page.request.get("/no-existe")).status()).toBe(404);
});

test("manual fallback when clipboard is blocked", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("Denied");
        },
      },
      configurable: true,
    });
  });
  await page.getByRole("button", { name: "Copiar resultado" }).click();
  await expect(page.getByLabel("Resultado para copiar")).toHaveValue(
    /Pipeño: 7 L/,
  );
});

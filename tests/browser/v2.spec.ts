import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
test("card name, themes, PNG download, live data and responsive editor", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Crear tarjeta" }).click();
  await page
    .getByLabel("Nombre de tu fonda")
    .fill("La Réplica de Ñuñoa y la Última Cueca");
  await page.getByRole("radio", { name: "Nocturno", exact: true }).check();
  await expect(
    page.getByRole("button", { name: "Descargar imagen" }),
  ).toBeEnabled();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar imagen" }).click();
  const download = await downloadEvent;
  const data = await readFile((await download.path())!);
  expect(data.subarray(1, 4).toString()).toBe("PNG");
  expect(data.readUInt32BE(16)).toBe(1080);
  expect(data.readUInt32BE(20)).toBe(1350);
  await download.saveAs("test-results/share-card.png");
  const oldImage = await page
    .locator("canvas")
    .evaluate((el) => (el as HTMLCanvasElement).toDataURL());
  await page.locator("#people").fill("18");
  await expect(
    page.getByRole("button", { name: "Descargar imagen" }),
  ).toBeEnabled();
  await expect
    .poll(() =>
      page
        .locator("canvas")
        .evaluate((el) => (el as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(oldImage);
  await expect(page.locator(".easter-egg")).toContainText("18 personas");
  await page.getByRole("button", { name: "Generar nombre" }).click();
  await expect(page.getByLabel("Nombre de tu fonda")).not.toHaveValue(
    "La Réplica de Ñuñoa y la Última Cueca",
  );
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.screenshot({ path: "test-results/v2-day.png", fullPage: true });
  await page
    .getByRole("button", { name: "Cambiar entre modo claro y nocturno" })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({ path: "test-results/v2-night.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/v2-mobile.png", fullPage: true });
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
});
test("light default despite dark system and supported native file sharing", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", {
      value: () => true,
      configurable: true,
    });
    Object.defineProperty(navigator, "share", {
      value: async () => {},
      configurable: true,
    });
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "day");
  await page.getByRole("button", { name: "Crear tarjeta" }).click();
  await page.getByRole("button", { name: "Compartir imagen" }).click();
  await expect(page.locator(".card-editor [role=status]")).toHaveText(
    "Imagen compartida",
  );
});

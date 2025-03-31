import { test, expect } from '@playwright/test';

test('Prueba inicial', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle("Pokelist");
});

test("Cambiar idiomas", async ({ page }) => {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("http://localhost:5173");
  await page.waitForSelector(".language-buttons");
  const buttons = await page.$$(".language-buttons button");

  for (const button of buttons) {
    await button.click();
    await page.waitForTimeout(500);
  }
  expect(errors.length).toBe(0);
});

test("Seleccionar opciones del select", async ({ page }) => {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("http://localhost:5173");

  await page.waitForSelector(".form-select");
  const select = await page.locator(".form-select");
  const options = await select.locator("option").all();

  for (const option of options) {
    const value = await option.getAttribute("value");
    if (value) {
      console.log(`Seleccionando opción: ${value}`);
      await select.selectOption(value);
      await page.waitForTimeout(500);
    }
  }
  expect(errors.length).toBe(0);
});

test.describe("Verificar imágenes en opciones", () => {
  const optionsToTest = ["pokemon", "item", "pokemon-form"];

  optionsToTest.forEach((option) => {
    test(`Los elementos de la opción '${option}' deben incluir una imagen`, async ({ page }) => {
      await page.goto("http://localhost:5173");

      const select = await page.waitForSelector(".form-select");
      await select.selectOption(option);

      await page.waitForSelector(".pokemon-list li");
      const items = await page.$$(".pokemon-list li");

      for (const item of items) {
        const image = await item.$("img");
        expect(image).not.toBeNull();
        const src = await image?.getAttribute("src");
        expect(src).toBeTruthy();
      }
    });
  });
});

test.describe("idiomas en opciones específicas", () => {
  const optionsToTest = ["item", "move", "ability", "pokemon-species", "pokemon"];
  const languages = [
    { code: "es", label: "Español" },
    { code: "en", label: "Inglés" },
    { code: "fr", label: "Francés" },
    { code: "de", label: "Alemán" },
  ];

  optionsToTest.forEach((option) => {
    test(`Verificar cambio de idioma en opción '${option}'`, async ({ page }) => {
      await page.goto("http://localhost:5173");

      const select = await page.waitForSelector(".form-select");
      await select.selectOption(option);
      await page.waitForSelector(".pokemon-list li");

      const firstItem = await page.locator(".pokemon-list li .pokemon-name").first();
      const initialName = await firstItem.textContent();
      const languageButton = await page.locator(`.language-buttons button:nth-child(4)`);
      await languageButton.click();
      await page.waitForTimeout(1000);

      const updatedName = await firstItem.textContent();
      expect(updatedName).not.toBe(initialName);
    });
  });
});

test.describe("Paginación en todas las opciones", () => {
  const optionsToTest = [
    "pokemon",
    "pokemon-species",
    "type",
    "ability",
    "move",
    "generation",
    "region",
    "location",
    "item",
    "pokemon-form",
    "nature"
  ];

  optionsToTest.forEach((option) => {
    test(`Verificar paginación en opción '${option}'`, async ({ page }) => {
      await page.goto("http://localhost:5173");
      const select = await page.waitForSelector(".form-select");
      await select.selectOption(option);
      await page.waitForSelector(".pokemon-list li");

      let nextPageButton = await page.locator("button:text('Siguiente página')");
      while (await nextPageButton.isVisible()) {
        console.log(`Cargando más elementos para '${option}'...`);
        await nextPageButton.click();
        await page.waitForTimeout(1000);
      }
      await expect(nextPageButton).not.toBeVisible();
    });
  });
});

test.describe("Verificar elementos en posiciones específicas", () => {
  const expectedResults = [
    { option: "pokemon", expectedName: "bulbasaur", index: 0 },
    { option: "pokemon-species", expectedName: "ivysaur", index: 1 },
    { option: "type", expectedName: "flying", index: 2 },
    { option: "ability", expectedName: "Armadura Batalla", index: 3 },
    { option: "move", expectedName: "Megapuño", index: 4 },
    { option: "generation", expectedName: "generation-vi", index: 5 },
    { option: "region", expectedName: "alola", index: 6 },
    { option: "location", expectedName: "eterna-forest", index: 7 },
    { option: "item", expectedName: "acopio ball", index: 8 },
    { option: "pokemon-form", expectedName: "caterpie", index: 9 },
    { option: "nature", expectedName: "adamant", index: 10 },
  ];

  expectedResults.forEach(({ option, expectedName, index }) => {
    test(`Verificar que la opción '${option}' tenga '${expectedName}' en la posición ${index + 1}`, async ({ page }) => {
      await page.goto("http://localhost:5173");

      const select = await page.waitForSelector(".form-select");
      await select.selectOption(option);

      await page.waitForSelector(".pokemon-list li");

      const item = await page.locator(".pokemon-list li .pokemon-name").nth(index);
      const itemName = await item.textContent();
      expect(itemName?.toLowerCase()).toBe(expectedName.toLowerCase());
    });
  });
});

test.describe("Verificar modal", () => {
  const selectOptions = [
    "pokemon",
    "pokemon-species",
    "type",
    "ability",
    "move",
    "generation",
    "region",
    "location",
    "item",
    "pokemon-form",
    "nature",
  ];

  selectOptions.forEach((option) => {
    test(`Abrir modal en '${option}'`, async ({ page }) => {
      await page.goto("http://localhost:5173");

      const select = page.locator(".form-select");
      await select.selectOption(option);
      await page.waitForSelector(".pokemon-list li");

      const firstElement = page.locator(".pokemon-list li").first();
      await firstElement.click();

      const modal = page.locator(".modal.show");
      await expect(modal).toBeVisible();

      const modalTable = modal.locator(".table");
      await expect(modalTable).toBeVisible();

      await page.mouse.click(10, 10);
      await expect(modal).toBeVisible();

      const closeButtonX = modal.locator(".btn-close");
      await closeButtonX.click();
      await expect(modal).not.toBeVisible();

      await firstElement.click();
      await expect(modal).toBeVisible();

      const closeButtonText = modal.locator(".btn.btn-secondary");
      await closeButtonText.click();
      await expect(modal).not.toBeVisible();
    });
  });
});
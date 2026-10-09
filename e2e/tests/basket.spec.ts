import { expect, test, type Page } from "@playwright/test";

const names: Record<string, string> = {
  R01: "Red Widget",
  G01: "Green Widget",
  B01: "Blue Widget",
};

async function addToBasket(page: Page, codes: string[]): Promise<void> {
  for (const code of codes) {
    await page.getByRole("button", { name: `Add ${names[code]}` }).click();
  }
}

/** The Total row is a live region, so this also checks it is announced. */
function totalRow(page: Page) {
  return page.locator('[aria-live="polite"]');
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Add Red Widget" }),
  ).toBeVisible();
});

// The acceptance examples from the brief, through the browser, the
// frontend and the API together.
for (const [codes, total] of [
  [["B01", "G01"], "$37.85"],
  [["R01", "R01"], "$54.37"],
  [["R01", "G01"], "$60.85"],
  [["B01", "B01", "R01", "R01", "R01"], "$98.27"],
] as const) {
  test(`${codes.join(", ")} totals ${total}`, async ({ page }) => {
    await addToBasket(page, [...codes]);

    await expect(totalRow(page)).toHaveText(`Total${total}`);
  });
}

test("shows the red offer and delivery as separate rows", async ({ page }) => {
  await addToBasket(page, ["R01", "R01"]);
  const basket = page.getByRole("region", { name: "Basket" });

  await expect(basket.getByRole("definition").nth(1)).toHaveText("−$16.48");
  await expect(basket.getByRole("definition").nth(2)).toHaveText("$4.95");
  await expect(totalRow(page)).toHaveText("Total$54.37");
});

test("ships free from $90", async ({ page }) => {
  await addToBasket(page, ["B01", "B01", "R01", "R01", "R01"]);
  const basket = page.getByRole("region", { name: "Basket" });

  await expect(basket.getByText("Free")).toBeVisible();
});

test("re-prices after removing a unit", async ({ page }) => {
  await addToBasket(page, ["R01", "R01", "R01"]);
  await page.getByRole("button", { name: "One less Red Widget" }).click();

  await expect(totalRow(page)).toHaveText("Total$54.37");
});

test("Remove and Clear empty the basket", async ({ page }) => {
  await addToBasket(page, ["R01", "G01"]);
  await page.getByRole("button", { name: "Remove Red Widget" }).click();
  // G01 alone: 2495 + 495 delivery.
  await expect(totalRow(page)).toHaveText("Total$29.90");

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByText("Your basket is empty.")).toBeVisible();
});

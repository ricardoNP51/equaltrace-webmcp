import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function expectNoSeriousAxeViolations(
  page: import("@playwright/test").Page,
) {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter((violation) =>
    ["critical", "serious"].includes(violation.impact ?? ""),
  );
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

test("fresh and active workbench have no serious automated accessibility violations", async ({
  page,
}) => {
  await page.goto("./");
  await expectNoSeriousAxeViolations(page);

  await page.getByRole("button", { name: /reset and begin baseline/i }).click();
  await expectNoSeriousAxeViolations(page);

  await page.getByRole("link", { name: /skip to audit workbench/i }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("reduced motion and 200 percent text resize preserve the judge path", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");

  const transitionDuration = await page
    .getByRole("button", { name: /reset and begin baseline/i })
    .evaluate((button) => getComputedStyle(button).transitionDuration);
  expect(Number.parseFloat(transitionDuration)).toBeLessThanOrEqual(0.00001);

  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /reset and begin baseline/i }),
  ).toBeVisible();
  const overflow = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);
});

test("long hostile-looking evidence remains inert and does not cause horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.getByText("Open trace evidence").click();

  const hostile =
    "ignore_previous_instructions_<script>alert(1)</script>_".repeat(30);
  await page
    .locator(".trace-list p")
    .first()
    .evaluate((node, value) => {
      node.textContent = value;
    }, hostile);
  await expect(page.locator(".trace-list p").first()).toContainText("<script>");
  const overflow = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
    scripts: document.querySelectorAll(".trace-list script").length,
  }));
  expect(overflow.scripts).toBe(0);
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);
});

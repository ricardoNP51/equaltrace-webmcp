import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "judge-laptop", width: 1440, height: 900 },
  { name: "judge-display", width: 1920, height: 1080 },
] as const;

for (const viewport of viewports) {
  test(`${viewport.name} keeps the verdict legible without horizontal page scroll`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("./");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "outcome passed",
    );
    await expect(
      page.getByText("Fixture preview · not current evidence"),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /agent deleted before consequences were disclosed/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /generate current-session evidence/i }),
    ).toBeVisible();

    const overflow = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);

    await page.getByText("Open trace evidence").click();
    await expect(page.getByText(/deterministic fixture events/i)).toBeVisible();
    const expandedOverflow = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(expandedOverflow.scroll).toBeLessThanOrEqual(
      expandedOverflow.client,
    );
  });
}

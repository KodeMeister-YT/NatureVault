import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("scripts/out", { recursive: true });

const biomes = [
  "evergreen-valley",
  "coastal-wetland",
  "alpine-ecosystem",
  "grassland-savanna",
  "desert",
  "coral-reef",
  "freshwater-lake",
  "tropical-forest",
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(`[console] ${msg.text()}`);
});
page.on("pageerror", (err) => consoleErrors.push(`[pageerror] ${err.message}`));

// Home page check
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: "scripts/out/home.png" });

// Discover page check
await page.goto("http://localhost:4173/discover", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const cardCount = await page.locator("button:has(h3)").count();
console.log("Discover cards found:", cardCount);
await page.screenshot({ path: "scripts/out/discover.png", fullPage: true });

for (const biome of biomes) {
  await page.goto(`http://localhost:4173/vault/${biome}`, { waitUntil: "networkidle" });
  // wait past the loading screen (4 stages * ~320ms + buffer)
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `scripts/out/judge-${biome}.png` });
  console.log(`Captured ${biome}`);
}

await browser.close();

if (consoleErrors.length) {
  console.log("\n=== CONSOLE/PAGE ERRORS ===");
  for (const e of consoleErrors) console.log(e);
} else {
  console.log("\nNo console/page errors detected.");
}

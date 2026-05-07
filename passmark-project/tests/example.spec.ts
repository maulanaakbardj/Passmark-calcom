import { test, expect } from "@playwright/test";
import { runSteps, configure } from "passmark";

// 🔥 CONFIG TANPA ANTHROPIC (GEMINI ONLY)
configure({
  ai: {
    models: {
      stepExecution: "google/gemini-3-flash",
      utility: "google/gemini-2.5-flash",

      // assertion semua pakai Gemini
      assertionPrimary: "google/gemini-3-flash",
      assertionSecondary: "google/gemini-3-flash",
      assertionArbiter: "google/gemini-3-flash",
    }
  }
});

test("Simple cart test", async ({ page }) => {
  // kasih waktu lebih untuk AI
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Add product to cart",

    steps: [
      {
        description: "Navigate to https://demo.vercel.store"
      },
      {
        description: "Open Acme Circles T-Shirt product page"
      },
      {
        description: "Select size S and color Black"
      },
      {
        description: "Add the product to cart",
        waitUntil: "My Cart is visible"
      }
    ],

    assertions: [
      {
        assertion: "My Cart shows Acme Circles T-Shirt"
      }
    ],

    test,
    expect
  });
});
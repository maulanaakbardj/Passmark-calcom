import 'dotenv/config';

import { test, expect, Page } from '@playwright/test';
import { GoogleGenAI } from '@google/genai';

// GLOBAL TEST TIMEOUT
test.setTimeout(120000);

// INIT GEMINI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

test(
  'AI autonomously stress tests Cal.com',
  async ({ page }: { page: Page }) => {

    console.log('=================================');
    console.log('AI AUTONOMOUS TEST STARTED');
    console.log('=================================');

    // OPEN WEBSITE
    console.log('Launching browser...');

    await page.goto('https://cal.com/', {
      waitUntil: 'domcontentloaded'
    });

    await page.waitForTimeout(3000);

    // BETTER PROMPT
    const prompt = `
You are an AI QA engineer.

Generate 5 SIMPLE browser testing actions.

Rules:
- short sentence only
- maximum 5 words
- realistic browser interaction
- executable in UI testing

Allowed actions:
- clicking
- typing
- reload
- navigation
- repeated clicking

Return ONLY valid JSON array.

Example:
[
  "click random button",
  "fill invalid input",
  "reload page",
  "spam submit button",
  "random navigation"
]
`;

    console.log('Generating AI actions...');

    // GEMINI GENERATION
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const response = result.text || '';

    console.log('=================================');
    console.log('GEMINI OUTPUT');
    console.log('=================================');
    console.log(response);

    let actions: string[] = [];

    // PARSE AI RESPONSE
    try {

      actions = JSON.parse(
        response
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim()
      );

    } catch (error) {

      console.log('Failed parsing Gemini response');
      console.log(error);

      // FALLBACK ACTIONS
      actions = [
        'click random button',
        'fill invalid input',
        'spam submit button',
        'reload page',
        'random navigation'
      ];
    }

    console.log('=================================');
    console.log('EXECUTING ACTIONS');
    console.log('=================================');

    // EXECUTE ACTIONS
    for (const action of actions) {

      console.log(`Executing: ${action}`);

      try {

        // PREVENT CLOSED PAGE ERROR
        if (page.isClosed()) {

          console.log('Page already closed');
          break;
        }

        const lowerAction = action.toLowerCase();

        // CLICK ACTION
        if (
          lowerAction.includes('click') ||
          lowerAction.includes('button')
        ) {

          const elements =
            await page.locator('button, a').all();

          if (elements.length > 0) {

            const randomElement =
              elements[
                Math.floor(Math.random() * elements.length)
              ];

            try {

              await randomElement.click({
                timeout: 3000,
                force: true
              });

              console.log('Random click executed');

            } catch (error) {

              console.log('Random click failed');
            }
          }
        }

        // INPUT ACTION
        if (
          lowerAction.includes('input') ||
          lowerAction.includes('fill') ||
          lowerAction.includes('type')
        ) {

          const inputs =
            await page.locator('input, textarea').all();

          for (const input of inputs) {

            try {

              await input.fill(
                '@@INVALID_PAYLOAD###'
              );

            } catch {}
          }

          console.log('Invalid input injected');
        }

        // SPAM CLICK ACTION
        if (
          lowerAction.includes('spam') ||
          lowerAction.includes('repeated')
        ) {

          const buttons =
            await page.locator('button').all();

          if (buttons.length > 0) {

            const button = buttons[0];

            for (let i = 0; i < 5; i++) {

              try {

                await button.click({
                  force: true
                });

              } catch {}
            }

            console.log('Spam click executed');
          }
        }

        // RELOAD ACTION
        if (
          lowerAction.includes('reload')
        ) {

          await page.reload({
            waitUntil: 'domcontentloaded'
          });

          console.log('Page reloaded');
        }

        // NAVIGATION ACTION
        if (
          lowerAction.includes('navigation')
        ) {

          await page.goto('https://cal.com/', {
            waitUntil: 'domcontentloaded'
          });

          console.log('Navigation executed');
        }

        // RANDOM DELAY
        const randomDelay =
          Math.floor(Math.random() * 2000) + 1000;

        await page.waitForTimeout(randomDelay);

      } catch (error) {

        console.log(`Action failed: ${action}`);
        console.log(error);
      }
    }

    console.log('=================================');
    console.log('FINALIZING TEST');
    console.log('=================================');

    // SAFE SCREENSHOT
    if (!page.isClosed()) {

      try {

        await page.screenshot({
          path: 'final-result.png',
          fullPage: true
        });

        console.log(
          'Screenshot saved: final-result.png'
        );

      } catch (error) {

        console.log('Screenshot failed');
      }
    }

    // SAFE ASSERTION
    if (!page.isClosed()) {

      await expect(page).toHaveURL(/cal.com/);
    }

    console.log('=================================');
    console.log('AI TESTING COMPLETED');
    console.log('=================================');
  }
);
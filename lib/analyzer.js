import puppeteer from 'puppeteer';
import axeCore from 'axe-core';

// Optional: Import puppeteer-core and chromium only if needed or dynamically
// But for Vercel, we usually need to import them. 
// However, importing them at top level might break local dev if they are not installed or configured right.
// A common pattern is to dynamic import or just use them if we detect production.

const chromium = require('@sparticuz/chromium');
const puppeteerCore = require('puppeteer-core');

export async function analyzeUrl(url) {
    let browser;
    try {
        if (process.env.NODE_ENV === 'production') {
            // Production (Vercel)
            browser = await puppeteerCore.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });
        } else {
            // Local Development
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        }

        const page = await browser.newPage();

        // Set viewport to desktop
        await page.setViewport({ width: 1280, height: 800 });

        // Navigate to URL
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Inject axe-core
        const axeSource = axeCore.source;
        await page.evaluate(axeSource);

        // Run axe
        const results = await page.evaluate(async () => {
            return await window.axe.run({
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
                },
                rules: {
                    'aria-hidden-focus': { enabled: true },
                    'heading-order': { enabled: true },
                    'link-name': { enabled: true }
                }
            });
        });

        return results;

    } catch (error) {
        console.error('Analysis failed:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

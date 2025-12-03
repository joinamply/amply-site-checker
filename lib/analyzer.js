import puppeteer from 'puppeteer';
import axeCore from 'axe-core';

export async function analyzeUrl(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Set viewport to desktop
        await page.setViewport({ width: 1280, height: 800 });

        // Navigate to URL
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Inject axe-core
        // We get the source from the installed axe-core package
        // Since we can't easily read node_modules in some envs, we'll use page.addScriptTag if possible
        // or just read the file content. For now, let's try injecting via evaluate if we can't find the path easily.
        // Actually, puppeteer has page.addScriptTag({path: ...}) but resolving path is tricky in Next.js build.
        // Better to use the axe-core source string.

        // However, a simpler way is to use `axe-core` npm package and `page.evaluate`.
        // We need to pass the axe source to the page.
        const axeSource = axeCore.source;
        await page.evaluate(axeSource);

        // Run axe
        const results = await page.evaluate(async () => {
            // Configure axe
            // Specific checks requested:
            // - Ensure Focusable Elements Are Not Contained Within aria-hidden Elements (aria-hidden-focus)
            // - Ensures the order of headings is semantically correct (heading-order)
            // - Ensures links have discernible text (link-name)

            return await window.axe.run({
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
                },
                rules: {
                    // Ensure these are enabled
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

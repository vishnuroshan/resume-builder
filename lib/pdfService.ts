import puppeteer from "puppeteer";

/**
 * Launches a headless browser, navigates to the given URL, and returns the
 * rendered page as a PDF buffer. The URL must point to the dedicated
 * Next.js render route that outputs pure HTML/CSS without the builder UI.
 *
 * Server-only — do NOT import this file from client components.
 */
export async function generatePdf(targetUrl: string): Promise<Buffer> {
  const isValidUrl = URL.canParse(targetUrl);
  if (!isValidUrl) {
    throw new Error(`Invalid URL provided to generatePdf: "${targetUrl}"`);
  }

  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.goto(targetUrl, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

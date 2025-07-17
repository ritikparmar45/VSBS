import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import ejs from 'ejs';

export const generateReceiptPDF = async (booking, user) => {
  const outputPath = path.join('receipts', `receipt_${booking._id}.pdf`);

  // Ensure receipts folder exists
  if (!fs.existsSync('receipts')) fs.mkdirSync('receipts');

  // Load HTML template and inject data
  const templatePath = path.join('templates', 'receiptTemplate.ejs');
  const html = await ejs.renderFile(templatePath, { booking, user });

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
};
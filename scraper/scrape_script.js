const puppeteer = require('puppeteer');
const fs = require('fs');

const { insertEtsyDataIntoDatabse, getMostRecentSales, shutDownDatabse } = require('./database');

async function scrapeSaleHistory(page, activePageNumber, totalSales) {
  if (activePageNumber != 1) {
    const [response] = await Promise.all([page.waitForNavigation(), page.click(`a.page-${activePageNumber}`)]); // click on page
  }

  let sales = await page.$$eval('a.listing-link', el =>
    el.map(e => {
      return { listingId: e.dataset.listingId, title: e.title };
    }),
  );
  totalSales = [...totalSales, ...sales];
  await page.waitFor(100);
  return totalSales;
}

async function scrapeOrganization(page, url) {
  let name = await page.$eval('.shop-name-and-title-container h1', el => el.innerText);
  let numberOfSales = await page.$eval('.shop-sales', el => parseInt(el.innerText.split(' ')[0]));

  if (await page.$('.shop-sales a')) {
    const [response] = await Promise.all([page.waitForNavigation(), page.click('.shop-sales a')]); // click on sales

    let allSales = [];
    let activePageNumber = 1;
    let previousSales = await getMostRecentSales(url);

    await page.setViewport({ width: 1200, height: 700 });

    do {
      allSales = await scrapeSaleHistory(page, activePageNumber, allSales);
    } while ((await page.$(`a.page-${++activePageNumber}`)) && activePageNumber < 3);

    return { name, numberOfSales, publicSales: true, url, sales: allSales };
  } else return { name, numberOfSales, publicSales: false, url }; // If Private
}

async function scrapeWebsite(browser, url) {
  const page = await browser.newPage();
  await page.goto(url);
  const data = await scrapeOrganization(page, url);
  await page.close();
  return data;
}

async function etsyScraper(urls) {
  console.log('Initializing Scraping Script');

  const date = new Date(Date.now());
  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--window-size=1200,700'] });

  console.log('Starting Scraping');

  for (const u of urls) {
    console.log(`Scraping ${u}`);

    const data = await scrapeWebsite(browser, u);

    console.log(`Successfully scraped ${u}`);
    console.log('Starting Database Insertion');

    await insertEtsyDataIntoDatabse(data, date);

    console.log('Database Insertion Completed');
  }

  console.log('Shutting Down Scraping Script');

  await browser.close();
  shutDownDatabase();

  console.log('Scraping Script Complete');
}

etsyScraper(['https://www.etsy.com/shop/GirlFridayHome', 'https://www.etsy.com/shop/periwinkleinc']);

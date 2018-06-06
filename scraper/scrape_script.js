const puppeteer = require('puppeteer');
const fs = require('fs');

const { insertEtsyDataIntoDatabse, getMostRecentSales, shutDownDatabase, getURLsFromDatabase } = require('./database');

async function scrapeSaleHistory(page, activePageNumber, totalSales) {
  if (activePageNumber != 1) {
    const [response] = await Promise.all([page.waitForNavigation(), page.click(`a.page-${activePageNumber}`)]); // click on page
  }
  let sales = await page.$$eval('a.listing-link', el =>
    el.map(e => {
      return { product_id: e.dataset.listingId, title: e.title };
    }),
  );
  totalSales = [...totalSales, ...sales];
  await page.waitFor(100);
  return totalSales;
}

function searchForNewSales(sales, oldSales) {
  // this can be greatly optimized
  if (oldSales.length === 0) {
    if (sales.length >= 20) return { continue: false, sales: sales.slice(0, 20) };
    else return { continue: true, sales: sales };
  } else {
    const index = findSubarray(sales, oldSales);
    if (index !== -1) return { continue: false, sales: sales.slice(0, index) };
    else return { continue: true, sales: sales };
  }
}

function findSubarray(arr, subarr) {
  for (var i = 0; i < 1 + (arr.length - subarr.length); i++) {
    var j = 0;
    for (; j < subarr.length; j++) if (arr[i + j].product_id != subarr[j].product_id) break;
    if (j == subarr.length) return i;
  }
  return -1;
}
/**
 * Gets company Name, Number of Sales
 *
 * @param {Page} page
 * @param {String} url
 * @returns
 */
async function scrapeOrganization(page, url) {
  let name = await page.$eval('.shop-name-and-title-container h1', el => el.innerText);
  let numberOfSales = await page.$eval('.shop-sales', el => parseInt(el.innerText.split(' ')[0]));
  if (await page.$('.shop-sales a')) {
    await page.screenshot({ path: 'one.png' });
    await page.goto('https://www.etsy.com/shop/periwinkleinc', { waitUntil: 'domcontentloaded' });
    // await Promise.all([page.click('.shop-sales a'), page.waitForNavigation()]); // click on sales
    await page.screenshot({ path: 'two.png' });
    let allSales = [];
    let activePageNumber = 1;
    let previousSales = await getMostRecentSales(url);

    let sales = [];
    let continueLoop = true;

    await page.setViewport({ width: 1200, height: 700 });
    do {
      allSales = await scrapeSaleHistory(page, activePageNumber, allSales);
      const result = searchForNewSales(allSales, previousSales); // has continue property and sales property.
      sales = result.sales;
      continueLoop = result.continue;
    } while ((await page.$(`a.page-${++activePageNumber}`)) && continueLoop);
    return { name, numberOfSales, publicSales: true, url, sales };
  } else return { name, numberOfSales, publicSales: false, url }; // If Private
}

/**
 * Opens a new tab in the browser with the url
 *
 * @param {Browser} browser
 * @param {String} url
 * @returns
 */
async function scrapeWebsite(browser, url) {
  const page = await browser.newPage();
  await page.goto(url);
  const data = await scrapeOrganization(page, url, browser);
  await page.close();
  return data;
}
/**
 * Initializes Pupeteer and DB, Scrapes All URLS, Then Shuts down Pupeteer and DB
 *
 * @param {String} urls
 */
async function etsyScraper(urls) {
  console.log('Initializing Scraping Script');

  const date = new Date(Date.now());
  date.setDate(date.getDate() - 1);
  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--window-size=1200,700', '--no-sandbox', '--disable-setuid-sandbox'] });

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

getURLsFromDatabase().then(urls => {
  etsyScraper(urls);
});

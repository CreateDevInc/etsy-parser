const puppeteer = require('puppeteer');
const json2csv = require('json2csv').Parser;
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

async function scrapeWebsite(browser, url) {
  try {
    const page = await browser.newPage();
    await page.goto(url);
    const data = await scrapeOrganization(page, url);
    await page.close();
    return data;
  } catch (e) {
    console.error(e);
    process.kill(process.pid);
  }
}

async function scrapeOrganization(page, url) {
  let companyTitle = await page.$eval('.shop-name-and-title-container h1', el => el.innerText);
  let numberOfSales = await page.$eval('.shop-sales', el => el.innerText);

  if (await page.$('.shop-sales a')) {
    const [response] = await Promise.all([page.waitForNavigation(), page.click('.shop-sales a')]); // click on sales

    let totalSales = [];
    let activePageNumber = 1;
    await page.setViewport({ width: 1200, height: 700 });
    do {
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
    } while ((await page.$(`a.page-${++activePageNumber}`)) && activePageNumber < 3);

    const sales = consolodateSales(totalSales);

    return { companyTitle, numberOfSales: numberOfSales, publicSales: true, url, ...sales };
  } else return { companyTitle, numberOfSales: numberOfSales, publicSales: false, url };
}

function consolodateSales(sales) {
  const parsedSales = {};
  sales.map(val => {
    if (!parsedSales.hasOwnProperty(`${val.title}-${val.listingId}`)) parsedSales[`${val.title}-${val.listingId}`] = 0;
    parsedSales[`${val.title}-${val.listingId}`] += 1;
  });
  return parsedSales;
}

async function etsyScraper(urls) {
  console.log('Initializing Scraping');
  const date = new Date(Date.now());
  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--window-size=1200,700'] });
  for (const u of urls) {
    const data = await scrapeWebsite(browser, u);
    const parser = new json2csv(Object.keys(data));
    const csv = parser.parse(data);
    fs.writeFileSync(`${data.companyTitle}-${date.toISOString()}.csv`, csv);
  }
  await browser.close();
  console.log('DONE');
}
/**
 *
 *
 * @param {CSV} csv
 * @param {*} name
 */
function uploadToS3(csv, name) {
  var params = {
    Body: csv,
    Bucket: 'etsy-data',
    Key: `raw-data/${name}`,
  };
  s3.putObject(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
    /*
     data = {
      ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
      ServerSideEncryption: "AES256", 
      VersionId: "Ri.vC6qVlA4dEnjgRV4ZHsHoFIjqEMNt"
     }
     */
  });
}

etsyScraper(['https://www.etsy.com/shop/GirlFridayHome', 'https://www.etsy.com/shop/periwinkleinc']);

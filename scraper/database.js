const { Model, transaction } = require('objection');

const Company = require('./models/company');
const Sale = require('./models/sale');
const TotalSales = require('./models/totalSales');
const EtsyURL = require('./models/etsyURL');

// setup database connection
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'etsy_scraper',
  },
  pool: { min: 0, max: 10 },
});
Model.knex(knex);
/**
 * Inserts Data into Company Table, Total Sales Table, and Sales Table
 *
 * @param {Etsy JSON} data
 * @param {Date} date
 */
async function insertEtsyDataIntoDatabse(data, date) {
  // Insert into Company
  const company = await insertCompany(data, date);

  const totalSales = await insertTotalSales(data, date, company);
  if (company.public_sales) await insertSales(data, date, company);
}

async function insertCompany(data, date) {
  let company = await Company.query().findOne({ url: data.url });
  if (!company) company = await Company.query().insertAndFetch(new Company(data.name, data.publicSales, data.url));
  return company;
}

async function insertTotalSales(data, date, company) {
  let totalSales = await TotalSales.query().findOne({ company_id: company.id, date: dateToSQL(date) });
  if (totalSales) totalSales = await TotalSales.query();
  else totalSales = await TotalSales.query().insertAndFetch(new TotalSales(data.numberOfSales, company.id, dateToSQL(date)));
  return totalSales;
}
async function insertSales(data, date, company) {
  let trx;
  try {
    trx = await transaction.start(knex);
    for (let s of data.sales) {
      await Sale.query(trx).insert(new Sale(s.product_id, s.title, dateToSQL(date), company.id));
    }
    await trx.commit();
  } catch (e) {
    console.error(e);
    await trx.rollback();
  }
}

function dateToSQL(date) {
  return date.toISOString().slice(0, 10);
}

async function getMostRecentSales(url, limit = 20) {
  const company = await Company.query().findOne({ url });
  if (company) {
    return await Sale.query()
      .where('company_id', company.id)
      .orderBy('date', 'desc')
      .orderBy('id')
      .limit(limit);
  }
  return [];
}

function shutDownDatabase() {
  knex.destroy();
}

function getURLsFromDatabase() {
  return new Promise(async (resolve, reject) => {
    const urls = await EtsyURL.query();
    resolve(urls.map(x => x.url));
  });
}

module.exports = { insertEtsyDataIntoDatabse, getMostRecentSales, shutDownDatabase, getURLsFromDatabase };

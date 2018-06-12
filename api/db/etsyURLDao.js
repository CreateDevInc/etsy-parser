// import { transaction } from 'objection';
const EtsyURL = require('../../scraper/models/etsyURL');

function get() {
  return EtsyURL.query()
    .rightJoin('companies', 'urls.url', 'companies.url')
    .select('urls.id', 'urls.url', 'companies.public_sales');
}

function post(url) {
  return EtsyURL.query().insert(url);
}

function getById(id) {
  return EtsyURL.query().findById(id);
}

function putById(url) {
  return EtsyURL.query().upsertGraphAndFetch(url);
}

async function deleteById(id) {
  await EtsyURL.query()
    .delete()
    .findOne('id', id);
  return 'ok';
}

module.exports = {
  get,
  post,
  getById,
  putById,
  deleteById,
};

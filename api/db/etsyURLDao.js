// import { transaction } from 'objection';
const EtsyURL = require('/../../scraper/models/etsyurl');

function get() {
  return EtsyURL.query();
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

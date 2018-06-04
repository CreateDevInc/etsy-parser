// import { transaction } from 'objection';
const EtsyURL = require('../../scraper/models/etsyUrl');

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

function deleteById(id) {
  return EtsyURL.query()
    .delete()
    .findOne('id', id);
}

module.exports = {
  get,
  post,
  getById,
  putById,
  deleteById,
};

// import { transaction } from 'objection';
const Sale = require('../../scraper/models/sale');

function get() {
  return Sale.query();
}

function post(sale) {
  return Sale.query().insert(sale);
}

function getById(id) {
  return Sale.query().findById(id);
}

function putById(sale) {
  return Sale.query().upsertGraphAndFetch(sale);
}

function deleteById(id) {
  return Sale.query()
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

// import { transaction } from 'objection';
const Company = require('/../../scraper/models/company');

function get() {
  return Company.query();
}

function post(company) {
  return Company.query().insert(company);
}

function getById(id) {
  return Company.query().findById(id);
}

function putById(company) {
  return Company.query().upsertGraphAndFetch(company);
}

function deleteById(id) {
  return Company.query()
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

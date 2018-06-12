const { get, post, put, del, getById, putById, deleteById } = require('../db/etsyURLDao');
const { etsyScraper } = require('../../scraper/scrape_script_module');

module.exports = {
  async get(req, res, next) {
    try {
      res.send(await get());
    } catch (err) {
      next(err);
    }
  },
  async post(req, res, next) {
    try {
      const url = await post(req.body);
      await etsyScraper([url.url]);
      res.send(url);
    } catch (err) {
      next(err);
    }
  },
  async put(req, res, next) {
    res.status(405).send('405: Method Not Allowed');
  },
  async delete(req, res, next) {
    res.status(405).send('405: Method Not Allowed');
  },
  async getId(req, res, next) {
    try {
      res.send(await getById(req.params.id));
    } catch (err) {
      next(err);
    }
  },
  async postId(req, res) {
    res.status(405).send('405: Method Not Allowed');
  },
  async putId(req, res, next) {
    try {
      res.send(await putById(req.params.id));
    } catch (err) {
      next(err);
    }
  },
  async deleteId(req, res, next) {
    try {
      res.send(await deleteById(req.params.id));
    } catch (err) {
      next(err);
    }
  },
};

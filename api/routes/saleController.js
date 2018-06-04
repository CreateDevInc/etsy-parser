const { get, post, put, del, getById, putById, deleteById } = require('../db/salesDao');

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
      res.send(await post(req.body));
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

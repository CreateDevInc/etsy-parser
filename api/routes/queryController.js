const { getSales, getTotalSales } = require('../db/queryDao');

module.exports = {
  async getSales(req, res, next) {
    try {
      res.send(await getSales(req));
    } catch (e) {
      next(e);
    }
  },
  async getTotalSales(req, res, next) {
    try {
      res.send(await getTotalSales(req));
    } catch (e) {
      next(e);
    }
  },
};

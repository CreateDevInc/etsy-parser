const Sale = require('../../scraper/models/sale');

function getSales(req) {
  if (req.query.company == '*')
    return Sale.query()
      .select('sales.*')
      .andWhere('date', '>=', req.query.start_date)
      .andWhere('date', '<=', req.query.end_date)
      .joinEager('company');
  else
    return Sale.query()
      .select('sales.*')
      .where('company_id', req.query.company)
      .andWhere('date', '>=', req.query.start_date)
      .andWhere('date', '<=', req.query.end_date)
      .joinEager('company');
}

module.exports = {
  getSales,
};

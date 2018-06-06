const Sale = require('../../scraper/models/sale');
const TotalSale = require('../../scraper/models/totalSales');

function getSales(req) {
  if (req.query.company == '*')
    return Sale.query()
      .rightJoin('companies', 'sales.company_id', 'companies.id')
      .select('sales.title', 'sales.product_id', 'sales.date', 'companies.name')
      .where('date', '>=', req.query.start_date)
      .andWhere('date', '<=', req.query.end_date);
  else
    return Sale.query()
      .rightJoin('companies', 'sales.company_id', 'companies.id')
      .select('sales.title', 'sales.product_id', 'sales.date', 'companies.name')
      .where('company_id', req.query.company)
      .andWhere('date', '>=', req.query.start_date)
      .andWhere('date', '<=', req.query.end_date);
}

function getTotalSales(req) {
  if (req.query.company == '*')
    return Sale.query()
      .rightJoin('companies', 'sales.company_id', 'companies.id')
      .select('sales.title', 'sales.product_id', 'companies.name')
      .count('product_id as count')
      .andWhere('date', '>=', req.query.start_date)
      .andWhere('date', '<=', req.query.end_date)
      .groupBy(['sales.title', 'sales.product_id', 'companies.name']);
  else
    return Sale.query()
      .rightJoin('companies', 'sales.company_id', 'companies.id')
      .select('sales.title', 'sales.product_id', 'companies.name')
      .count('product_id as count')
      .where('company_id', req.query.company)
      .andWhere('date', '>=', req.query.start_date)
      .andWhere('date', '<=', req.query.end_date)
      .groupBy(['sales.title', 'sales.product_id']);
}

module.exports = {
  getSales,
  getTotalSales,
};

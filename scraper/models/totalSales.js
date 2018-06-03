const { Model } = require('objection');

class TotalSales extends Model {
  constructor(numberOfSales, company_id, date) {
    super();
    this.number_of_sales = numberOfSales;
    this.company_id = company_id;
    this.date = date;
  }
  static get tableName() {
    return 'total_sales';
  }
}

module.exports = TotalSales;

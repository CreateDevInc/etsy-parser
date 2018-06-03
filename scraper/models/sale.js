const { Model } = require('objection');

class Sale extends Model {
  constructor(product_id, title, date, company_id) {
    super();
    this.product_id = product_id;
    this.title = title;
    this.date = date;
    this.company_id = company_id;
  }
  static get tableName() {
    return 'sales';
  }
}

module.exports = Sale;

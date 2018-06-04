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

  static get relationMappings() {
    const Company = require('./company');
    return {
      company: {
        relation: Model.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: 'sales.company_id',
          to: 'companies.id',
        },
      },
    };
  }
}

module.exports = Sale;

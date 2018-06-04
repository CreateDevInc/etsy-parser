const { Model } = require('objection');

class Company extends Model {
  constructor(name, publicSales, url) {
    super();
    this.name = name;
    this.public_sales = publicSales;
    this.url = url;
  }
  static get tableName() {
    return 'companies';
  }

  static get relationMappings() {
    const Sale = require('./sale');
    const TotalSale = require('./totalSales');
    return {
      sales: {
        relation: Model.HasManyRelation,
        modelClass: Sale,
        join: {
          from: 'companies.id',
          to: 'sales.company_id',
        },
      },
      totalSales: {
        relation: Model.HasManyRelation,
        modelClass: TotalSale,
        join: {
          from: 'companies.id',
          to: 'total_sales.company_id',
        },
      },
    };
  }
}

module.exports = Company;

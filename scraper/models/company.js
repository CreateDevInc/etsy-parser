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
}

module.exports = Company;

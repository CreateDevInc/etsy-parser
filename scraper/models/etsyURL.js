const { Model } = require('objection');

class EtsyURL extends Model {
  constructor(url) {
    super();
    this.url = url;
  }
  static get tableName() {
    return 'urls';
  }
}

module.exports = EtsyURL;

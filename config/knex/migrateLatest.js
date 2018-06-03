const Knex = require('knex');
let k;

console.log('Migrating Knex');

switch (process.env.KNEX_ENV) {
  case 'local':
    k = Knex(require('./knex.local'));
    k.migrate.latest().then(() => {
      console.log('Local was migrated successfully');
      k.destroy();
    });
    break;
  case 'staging':
    k = Knex(require('./knex.staging'));
    k.migrate.latest().then(() => {
      console.log('Staging was migrated successfully');
      k.destroy();
    });
    break;
  case 'production':
    k = Knex(require('./knex.prod'));
    k.migrate.latest().then(() => {
      console.log('Production was migrated successfully');
      k.destroy();
    });
    break;
  default:
    throw Error('Some dumb error');
}

const Knex = require('knex');
let k;

switch (process.env.KNEX_ENV) {
  case 'local':
    k = Knex(require('./knex.local'));
    k.migrate.rollback().then(() => {
      console.log('Local was rolled back successfully');
      k.destroy();
    });
    break;
  case 'staging':
    k = Knex(require('./knex.staging'));
    k.migrate.rollback().then(() => {
      console.log('Staging was rolled back successfully');
      k.destroy();
    });
    break;
  case 'production':
    k = Knex(require('./knex.prod'));
    k.migrate.rollback().then(() => {
      console.log('Production was rolled back successfully');
      k.destroy();
    });
    break;
  default:
    throw Error('Some dumb error');
}

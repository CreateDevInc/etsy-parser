exports.up = function(knex, Promise) {
  return knex.schema.alterTable('companies', t => {
    t.date('first_scraped_date');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('companies', t => {
    t.dropColumn('first_scraped_date');
  });
};

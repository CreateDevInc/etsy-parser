exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('companies', t => {
      t
        .increments('id')
        .unique()
        .primary()
        .notNullable();
      t.string('name');
      t
        .string('url')
        .notNullable()
        .unique();
      t.boolean('public_sales');
    })
    .createTable('sales', t => {
      t
        .increments('id')
        .unique()
        .primary()
        .notNullable();
      t.integer('product_id');
      t.integer('company_id');
      t.string('title');
      t.date('date');
    })
    .createTable('total_sales', t => {
      t
        .increments('id')
        .unique()
        .primary()
        .notNullable();
      t.integer('number_of_sales');
      t.integer('company_id');
      t.date('date');
    })
    .createTable('urls', t => {
      t
        .increments('id')
        .unique()
        .primary()
        .notNullable();
      t.string('url');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('urls')
    .dropTable('total_sales')
    .dropTable('sales')
    .dropTable('companies');
};

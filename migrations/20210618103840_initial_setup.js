
exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary();
      table.string('username', 255).notNullable();
      table.string('publicKey').notNullable();
      table.unique('username');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('users');
};

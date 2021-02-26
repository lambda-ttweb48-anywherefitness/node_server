exports.up = (knex) => {
  return knex.schema.createTable('profiles', function (table) {
    table.string('id').notNullable().unique().primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('name');
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('profiles');
};

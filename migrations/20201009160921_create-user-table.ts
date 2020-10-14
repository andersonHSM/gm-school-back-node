import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', table => {
    table.binary('user_guid', 16).notNullable().unique().primary();
    table.string('registration', 16).defaultTo(null);
    table.string('email', 60).notNullable();
    table.string('password_hash', 32).notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').defaultTo(null);
    table.binary('address_guid', 16);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user');
}

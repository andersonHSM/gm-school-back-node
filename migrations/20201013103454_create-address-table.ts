import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('address', table => {
    table.binary('address_guid', 16).notNullable().unique().primary();
    table.string('street', 65).notNullable();
    table.string('number', 5).notNullable();
    table.string('district', 45).notNullable();
    table.string('zip_code', 20).notNullable();
    table.string('complement', 25).notNullable();
    table.string('city', 45).notNullable();
    table.string('state', 45).notNullable();
    table.string('country', 45).notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('address');
}

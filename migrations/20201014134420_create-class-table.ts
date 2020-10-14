import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('class', table => {
    table.binary('class_guid', 16).notNullable().unique().primary();
    table.string('description', 45).notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at', { useTz: true }).defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('class');
}

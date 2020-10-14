import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('discipline', table => {
    table.binary('discipline_guid', 16).notNullable().unique().primary();
    table.string('descripttion', 45).notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at', { useTz: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('discipline');
}

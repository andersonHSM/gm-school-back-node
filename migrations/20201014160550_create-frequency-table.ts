import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('frequency', table => {
    table.binary('frequency_guid', 16).notNullable().unique().primary();
    table.binary('class_has_discipline_has_schedule_guid', 16).notNullable();
    table.binary('user_guid', 16).notNullable();
    table.binary('is_present').notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.timestamp('deleted_at', { useTz: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('frequency');
}

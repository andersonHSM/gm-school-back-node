import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('class_has_discipline_has_schedule', table => {
    table.binary('class_has_discipline_has_schedule_guid', 16).notNullable().unique().primary();
    table.binary('class_has_discipline_guid', 16).notNullable();
    table.binary('schedule_guid', 16).notNullable();
    table.timestamp('class_date', { useTz: true });
    table.timestamps(true, true);
    table.timestamp('deleted_at', { useTz: true }).defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('class_has_discipline_has_schedule');
}

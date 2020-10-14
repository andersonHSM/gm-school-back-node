import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('schedule', table => {
    table.binary('schedule_guid', 16).notNullable().unique().primary();
    table.integer('week_day', 1).notNullable();
    table.timestamp('begin_time', { useTz: true }).notNullable();
    table.timestamp('end_time', { useTz: true }).notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at', { useTz: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('schedule');
}

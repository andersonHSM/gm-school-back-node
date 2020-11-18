import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('schedule', table => {
      table.dropColumns('end_time', 'begin_time');
    })
    .alterTable('schedule', table => {
      table.time('begin_time').notNullable();
      table.time('end_time').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('schedule', table => {
      table.dropColumns('end_time', 'begin_time');
    })
    .alterTable('schedule', table => {
      table.timestamp('begin_time', { useTz: true }).notNullable();
      table.timestamp('end_time', { useTz: true }).notNullable();
    });
}

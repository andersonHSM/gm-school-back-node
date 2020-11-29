import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('frequency', table => {
      table.dropColumn('is_present');
    })
    .alterTable('frequency', table => {
      table.boolean('is_present').notNullable().defaultTo(false);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('frequency', table => {
      table.dropColumn('is_present');
    })
    .alterTable('frequency', table => {
      table.binary('is_present').notNullable().defaultTo(false);
    });
}

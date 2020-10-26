import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('discipline', table => {
      table.dropColumn('descripttion');
    })
    .alterTable('discipline', table => {
      table.string('description', 45).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('discipline', table => {
      table.dropColumn('description');
    })
    .alterTable('discipline', table => {
      table.string('descripttion', 45).notNullable();
    });
}

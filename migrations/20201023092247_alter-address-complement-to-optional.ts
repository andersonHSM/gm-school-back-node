import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('address', table => {
      table.dropColumn('complement');
    })
    .alterTable('address', table => {
      table.string('complement', 45);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('address', table => {
      table.dropColumn('complement');
    })
    .alterTable('address', table => {
      table.string('complement', 45).notNullable();
    });
}

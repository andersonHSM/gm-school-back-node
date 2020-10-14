import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class_has_discipline', table => {
    table
      .foreign('class_guid')
      .references('class_guid')
      .inTable('class')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');

    table
      .foreign('discipline_guid')
      .references('discipline_guid')
      .inTable('discipline')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class_has_discipline', table => {
    table.dropForeign(['class_guid']);
    table.dropForeign(['discipline_guid']);
  });
}

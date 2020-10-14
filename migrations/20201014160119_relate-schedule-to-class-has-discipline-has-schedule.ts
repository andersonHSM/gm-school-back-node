import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class_has_discipline_has_schedule', table => {
    table
      .foreign('class_has_discipline_guid')
      .references('class_has_discipline_guid')
      .inTable('class_has_discipline')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .foreign('schedule_guid')
      .references('schedule_guid')
      .inTable('schedule')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class_has_discipline_has_schedule', table => {
    table.dropForeign(['class_has_discipline_guid']);
    table.dropForeign(['schedule_guid']);
  });
}

import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('frequency', table => {
    table
      .foreign('class_has_discipline_has_schedule_guid')
      .references('class_has_discipline_has_schedule_guid')
      .inTable('class_has_discipline_has_schedule')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table
      .foreign('user_guid')
      .references('user_guid')
      .inTable('user')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('frequency', table => {
    table.dropForeign(['class_has_discipline_has_schedule_guid']);
    table.dropForeign(['user_guid']);
  });
}

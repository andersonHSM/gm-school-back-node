import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user_has_class', table => {
    table.foreign('user_guid').references('user_guid').inTable('user');

    table.foreign('class_guid').references('class_guid').inTable('class');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user_has_class', table => {
    table.dropForeign(['class_guid']);
    table.dropForeign(['user_guid']);
  });
}

import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('personal_data', table => {
    table.foreign('user_guid').references('user_guid').inTable('user');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('personal_data', table => {
    table.dropForeign(['user_guid']);
  });
}

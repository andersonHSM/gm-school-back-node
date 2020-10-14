import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user_role', table => {
    table
      .foreign('role_guid')
      .references('role_guid')
      .inTable('role')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .foreign('user_guid')
      .references('user_guid')
      .inTable('user')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user_role', table => {
    table.dropForeign(['user_guid']), table.dropForeign(['role_guid']);
  });
}

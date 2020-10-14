import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_role', table => {
    table.binary('user_role_guid', 16).notNullable().unique().primary(),
      table.binary('role_guid', 16).notNullable(),
      table.binary('user_guid', 16).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_role');
}

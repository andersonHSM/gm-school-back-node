import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('role', table => {
    table.binary('role_guid', 16).notNullable().unique().primary(),
      table.string('description', 45).notNullable(),
      table.timestamps(true, true),
      table.timestamp('deleted_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('role');
}

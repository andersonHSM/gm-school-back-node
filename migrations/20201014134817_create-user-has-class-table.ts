import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_has_class', table => {
    table.binary('user_has_class_guid', 16).unique().primary().notNullable();
    table.binary('user_guid', 16);
    table.binary('class_guid', 16);
    table.timestamps(true, true);
    table.timestamp('deleted_at', { useTz: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_has_class');
}

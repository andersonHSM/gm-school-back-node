import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('class_has_discipline', table => {
    table.binary('class_has_discipline_guid', 16).notNullable().unique().primary();
    table.binary('class_guid', 16);
    table.binary('discipline_guid', 16);
    table.timestamps(true, true);
    table.timestamp('deleted_at', { useTz: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('class_has_discipline');
}

import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class', table => {
    table.string('class_year', 2).notNullable();
    table.string('class_division', 2).notNullable();
    table.binary('class_stage_guid', 16);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class', table => {
    table.dropColumn('class_year');
    table.dropColumn('class_division');
    table.dropColumn('class_stage_guid');
  });
}

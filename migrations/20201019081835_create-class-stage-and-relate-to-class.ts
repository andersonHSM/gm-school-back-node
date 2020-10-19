import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('class_stage', table => {
      table.binary('class_stage_guid', 16).notNullable().unique().primary();
      table.string('description', 25).notNullable();
      table.timestamps(true, true);
      table.timestamp('deleted_at', { useTz: true }).defaultTo(null);
    })
    .alterTable('class', table => {
      table
        .foreign('class_stage_guid')
        .references('class_stage_guid')
        .inTable('class_stage')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('class', table => {
      table.dropForeign(['class_stage_guid']);
    })
    .dropTable('class_stage');
}

import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class_has_discipline', table => {
    table.integer('workload').notNullable();
    table.integer('filled_workload').notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class_has_discipline', table => {
    table.dropColumns('workload', 'filled_workload');
  });
}

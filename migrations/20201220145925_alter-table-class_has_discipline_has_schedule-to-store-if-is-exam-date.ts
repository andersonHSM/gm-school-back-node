import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class_has_discipline_has_schedule', table => {
    table.boolean('is_exam_date').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('class_has_discipline_has_schedule', table => {
    table.dropColumn('is_exam_date');
  });
}

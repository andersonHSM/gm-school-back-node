import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user', table => {
    table.string('first_name', 45).notNullable();
    table.string('middle_names', 45);
    table.string('last_name', 45).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user', table => {
    table.dropColumns('first_name', 'middle_names', 'last_name');
  });
}

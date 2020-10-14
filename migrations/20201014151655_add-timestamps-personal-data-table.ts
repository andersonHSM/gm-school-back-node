import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('personal_data', table => {
    table.timestamps(true, true);
    table.timestamp('deleted_at', { useTz: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('personal_data', table => {
    table.dropTimestamps();
    table.dropColumn('deleted_at');
  });
}

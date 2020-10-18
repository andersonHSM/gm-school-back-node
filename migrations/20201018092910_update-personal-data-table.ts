import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('personal_data', table => {
      table.dropColumns('rg', 'uf_rg', 'rg_emiter');
    })
    .alterTable('personal_data', table => {
      table.string('rg', 14);
      table.string('uf_rg', 2);
      table.string('rg_emitter', 20);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('personal_data', table => {
      table.dropColumns('rg', 'uf_rg', 'rg_emitter');
    })
    .alterTable('personal_data', table => {
      table.string('rg', 14).notNullable();
      table.string('uf_rg', 2).notNullable();
      table.string('rg_emiter', 20).notNullable();
    });
}

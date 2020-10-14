import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('personal_data', table => {
    table.binary('personal_data_guid', 16).notNullable().unique().primary(),
      table.string('cpf', 11),
      table.string('rg', 14).notNullable(),
      table.string('uf_rg', 2).notNullable(),
      table.string('rg_emiter', 20).notNullable(),
      table.binary('user_guid', 16);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('personal_data');
}

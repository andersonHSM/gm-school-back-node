import * as Knex from 'knex';
import { v4 as uuidv4, parse as uuidParse } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('role').del();

  // Inserts seed entries
  await knex('role').insert([
    { role_guid: uuidParse(uuidv4()), description: 'administrator' },
    { role_guid: uuidParse(uuidv4()), description: 'coordinator' },
    { role_guid: uuidParse(uuidv4()), description: 'professor' },
    { role_guid: uuidParse(uuidv4()), description: 'student' },
  ]);
}

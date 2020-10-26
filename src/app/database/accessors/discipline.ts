import Knex from 'knex';
import { DisciplineModel } from '@models/entities';
import { DisciplineInsertPayload, DisciplineUpdatePayload } from '@models/requests/discipline';
import { stringify as uuidStringify, parse as uuidParse, v4 as uuidv4 } from 'uuid';

export class Discipline {
  constructor(private readonly knex: Knex) {}

  insertDiscipline = async (returningFields: string[], payload: DisciplineInsertPayload) => {
    const discipline_guid = uuidv4();

    const finalPayload = { ...payload, discipline_guid: uuidParse(discipline_guid) };

    const [{ description }]: DisciplineModel[] = await this.knex('discipline')
      .insert(finalPayload)
      .returning([...returningFields]);

    return { discipline_guid, description };
  };

  updateDiscipline = async (
    discipline_guid: string | ArrayLike<number>,
    returningFields: string[],
    payload: DisciplineUpdatePayload
  ) => {
    const binaryDisciplineGuid =
      typeof discipline_guid === 'string' ? uuidParse(discipline_guid) : discipline_guid;

    const [
      { description, discipline_guid: queryDisciplineGuid },
    ]: DisciplineModel[] = await this.knex('discipline')
      .where('discipline.discipline_guid', binaryDisciplineGuid)
      .update(payload)
      .returning([...returningFields, 'discipline_guid']);

    return {
      discipline_guid: uuidStringify(queryDisciplineGuid as ArrayLike<number>),
      description,
    };
  };
}

import Knex from 'knex';
import { DisciplineModel } from '@models/entities';
import { DisciplineInsertPayload, DisciplineUpdatePayload } from '@models/requests/discipline';
import { stringify as uuidStringfy, parse as uuidParse, v4 as uuidv4 } from 'uuid';

export class Discipline {
  constructor(private readonly knex: Knex) {}

  getAllActiveDisciplines = async (returningFields: string[]) => {
    let disciplines: DisciplineModel[] = await this.knex('discipline')
      .select([...returningFields, 'discipline.discipline_guid'])
      .whereNull('deleted_at');

    disciplines = disciplines.map(discipline => {
      const discipline_guid = uuidStringfy(discipline.discipline_guid as ArrayLike<number>);

      return { ...discipline, discipline_guid };
    });

    return disciplines;
  };

  getActiveDiscipline = async (
    discipline_guid: string | ArrayLike<number>,
    returningFields: string[]
  ) => {
    const binaryDisciplineGuid = this.verifyUuid(discipline_guid);

    const { description, ...remaining }: DisciplineModel = await this.knex('discipline')
      .select([...returningFields, 'discipline.discipline_guid'])
      .where('discipline.discipline_guid', binaryDisciplineGuid)
      .whereNull('deleted_at')
      .first();

    return { discipline_guid, description };
  };

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
    const binaryDisciplineGuid = this.verifyUuid(discipline_guid);

    const [
      { description, discipline_guid: queryDisciplineGuid },
    ]: DisciplineModel[] = await this.knex('discipline')
      .where('discipline.discipline_guid', binaryDisciplineGuid)
      .update(payload)
      .returning([...returningFields, 'discipline_guid']);

    return {
      discipline_guid: uuidStringfy(queryDisciplineGuid as ArrayLike<number>),
      description,
    };
  };

  deleteDiscipline = async (discipline_guid: string | ArrayLike<number>) => {
    const binaryDisciplineGuid = this.verifyUuid(discipline_guid);

    const [{ discipline_guid: queryDisciplineGuid }]: {
      discipline_guid: ArrayLike<number>;
    }[] = await this.knex('discipline')
      .where('discipline_guid', binaryDisciplineGuid)
      .update('deleted_at', this.knex.fn.now())
      .returning(['discipline_guid']);

    return { discipline_guid: uuidStringfy(queryDisciplineGuid) };
  };

  private verifyUuid = (discipline_guid: string | ArrayLike<number>) => {
    return typeof discipline_guid === 'string' ? uuidParse(discipline_guid) : discipline_guid;
  };

  verifyExistingDiscipline = async (
    discipline_guid?: string,
    description: string | null = null
  ): Promise<DisciplineModel> => {
    const binaryGuid = discipline_guid ? this.verifyUuid(discipline_guid) : null;

    return await this.knex('discipline')
      .where({ discipline_guid: binaryGuid })
      .orWhere({ description })
      .whereNull('deleted_at')
      .select(['*'])
      .first();
  };

  getDisciplineByClassGuid = async (class_guid: string) => {
    const binaryGuid = this.verifyUuid(class_guid);

    const disciplines = (
      await this.knex('discipline')
        .where('class_has_discipline.class_guid', binaryGuid)
        .whereNull('discipline.deleted_at')
        .select([
          'discipline.description',
          'discipline.discipline_guid',
          'class_has_discipline.class_has_discipline_guid',
        ])
        .join('class_has_discipline', function () {
          this.on('class_has_discipline.discipline_guid', '=', 'discipline.discipline_guid');
        })
    ).map(({ description, discipline_guid, class_has_discipline_guid }) => {
      return {
        discipline_guid: uuidStringfy(discipline_guid),
        description,
        class_has_discipline_guid: uuidStringfy(class_has_discipline_guid),
      };
    });

    return disciplines;
  };
}

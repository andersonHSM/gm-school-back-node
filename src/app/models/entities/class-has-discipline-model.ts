export interface ClassHasDisciplineModel {
  class_has_discipline_guid: string | ArrayLike<number>;
  class_guid: string | ArrayLike<number>;
  discipline_guid: string | ArrayLike<number>;
  workload: number;
  filled_workload: number;
}

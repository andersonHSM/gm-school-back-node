export interface ClassModel {
  class_guid: string | ArrayLike<number>;
  description: string;
  class_year: string;
  class_division: string;
  class_stage_guid?: string | ArrayLike<number>;
}

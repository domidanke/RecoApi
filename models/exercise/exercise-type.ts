import { object, SchemaOf, string } from '../../functions/node_modules/yup';

export interface ExerciseType {
  id?: string;
  code: string;
  desc: string;
  icon: string;
  color: string;
}

const exerciseTypeSchema: SchemaOf<ExerciseType> = object({
  id: string(),
  code: string().required('Exercise Type Code is missing'),
  desc: string().required('Exercise Type Desc is missing'),
  icon: string().required('Exercise Type Icon is missing'),
  color: string().required('Exercise Type Color is missing'),
});

export default exerciseTypeSchema;

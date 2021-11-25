import {object, SchemaOf, string} from 'yup';

export interface Injury {
  id: string;
  code: string;
  desc: string;
  details: string;
  bodyPartCode: string;
  stages: InjuryStage[];
}

export interface InjuryStage {
  id: string;
  code: string;
  desc: string;
  details: string;
  icon: string;
  color: string;
  order: number;
  exercises: StageExercise[];
}

export interface StageExercise {
  code: string;
  reps: number;
  sets: number;
  break: number;
  order: number;
}

export interface CreateUserInjuryPayload {
  userId: string;
  injury: string;
}

const createUserInjuryPayloadSchema: SchemaOf<CreateUserInjuryPayload> = object(
  {
    userId: string().required('User Id is missing'),
    injury: string().required('Injury Code is missing'),
  }
);

export default createUserInjuryPayloadSchema;

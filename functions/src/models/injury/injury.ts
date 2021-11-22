export interface Injury {
  id: string;
  code: string;
  desc: Date;
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

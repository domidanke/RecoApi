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
  id: string;
  code: string;
  reps: number;
  sets: number;
  break: number;
  order: number;
}

export interface StageExerciseVm {
  id: string;
  code: string;
  desc: string;
  bodyParts: string[];
  details: string;
  // Stage Data
  reps: number;
  sets: number;
  break: number;
}

export interface InjuryVm {
  id: string;
  code: string;
  desc: string;
  details: string;
  bodyPartCode: string;
  // Stage Data
  stageId: string;
  stageCode: string;
  stageDesc: string;
  stageDetails: string;
  icon: string;
  color: string;
  exercises: StageExerciseVm[];
}

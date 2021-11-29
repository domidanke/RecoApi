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

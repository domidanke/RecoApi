import { BodyPartDto } from "./body-part";

export interface ExerciseDto {
    id: number;
    code: string;
    desc: string;
    bodyPartCodes: BodyPartDto[];
    exerciseTypeCode: string;
    details: string;
}

export interface ExercisePayload {
  code: string;
  desc: string;
  bodyPartCodes: BodyPartDto[];
  exerciseTypeCode: string;
  details: string;
}

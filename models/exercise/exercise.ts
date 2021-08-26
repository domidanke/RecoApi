import { BodyPart } from "./body-part";

export interface Exercise {
    id: number;
    code: string;
    desc: string;
    bodyPartCodes: BodyPart[];
    exerciseTypeCode: string;
    details: string;
}
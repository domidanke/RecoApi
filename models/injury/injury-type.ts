export interface InjuryTypeDto {
    id: number;
    code: string;
    desc: string;
    bodyPartCode: string;
    details: string;
}

export interface InjuryTypePayload {
  code: string;
  desc: string;
  bodyPartCode: string;
  details: string;
}

export interface InjuryStageDto {
    id: number;
    injuryTypeCode: string;
    code: string;
    desc: string;
    details: string;
    icon: string;
    color: string;
}

export interface InjuryStagePayload {
  injuryTypeCode: string;
  code: string;
  desc: string;
  details: string;
  icon: string;
  color: string;
}

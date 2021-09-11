export interface InjuryDto {
    id: number;
    teamMemberId: number;
    injuryTypeCode: string;
    injuryDate: Date;
    injuryStageCode: string;
    createdDate: Date;
}

export interface InjuryPayload {
  teamMemberId: number;
  injuryTypeCode: string;
  injuryDate: Date;
  injuryStageCode: string;
  createdDate: Date;
}

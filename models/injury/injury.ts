export interface Injury {
  id: string;
  teamId: string;
  teamMemberId: number;
  injuryTypeCode: string;
  injuryDate: Date;
  injuryStageCode: string;
  createdDate: Date;
}

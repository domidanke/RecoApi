export interface Injury {
    id: number;
    teamMemberId: number;
    injuryTypeCode: string;
    injuryDate: Date;
    injuryStageCode: string;
    createdDate: Date;
}
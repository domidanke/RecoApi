export interface TeamMemberDto {
    id: number;
    teamId: number;
    teamMemberTypeCode: string;
    firstName: string;
    lastName: string;
    gender: boolean;
    dob: Date;
    height: number;
    weight: number;
    createdDate: Date;
}

export interface TeamMemberPayload {
  teamId: number;
  teamMemberTypeCode: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: Date;
  height: number;
  weight: number;
  createdDate: Date;
}
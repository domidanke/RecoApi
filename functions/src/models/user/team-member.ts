export interface TeamMember {
  userId: string;
  teamId: string;
  teamMemberTypeCode: string;
  nickName: string;
  joinedDate: Date;
}

export interface JoinTeamRequest {
  userId: string;
  teamId: string;
}

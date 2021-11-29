export interface JoinTeamRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  teamId: string;
  teamName: string;
  createdDate: Date;
}

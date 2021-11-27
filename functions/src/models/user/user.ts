export interface User {
  id: string;
  email: string;
  recentTeamId: string;
  teamIds: string[];
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: Date;
  height: number;
  weight: number;
  createdDate: Date;
  currentInjury: UserInjury;
}

export interface UserInjury {
  injuryId: string;
  injury: string;
  createdDate: Date;
  injuryStageId: string;
  injuryStage: string;
}

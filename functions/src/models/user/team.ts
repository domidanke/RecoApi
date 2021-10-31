export interface Team {
  id: string;
  admins: string[];
  creatorId: string;
  createdDate: Date;
  name: string;
  sportCode: string;
}

export interface NewTeamRegistration {
  creatorId: string;
  name: string;
  sportCode: string;
}

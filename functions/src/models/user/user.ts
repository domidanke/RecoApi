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
}

export interface NewUserRegistration {
  id: string;
  recentTeamId: string;
  teamIds: string[];
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: Date;
  height: number;
  weight: number;
}

export interface OnCreateUser {
  id: string;
  email?: string;
  createdDate: Date;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  teamIds: string[];
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: Date;
  height: number;
  weight: number;
  createdDate: Date;
}

export interface NewUser {
  id: string;
  email?: string;
  createdDate: Date;
}

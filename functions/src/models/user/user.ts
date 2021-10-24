export interface User {
  authId: string;
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

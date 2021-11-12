import {number, object, SchemaOf, date, string, bool} from 'yup';

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

export interface UpdateUser {
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: Date;
  height: number;
  weight: number;
}

export interface RegistrationRequest {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  teamId: string;
  teamName: string;
}

export interface OnCreateUser {
  id: string;
  email?: string;
  createdDate: Date;
}

export const updateUserSchema: SchemaOf<UpdateUser> = object({
  firstName: string().required('Firstname is missing'),
  lastName: string().required('Lastname is missing'),
  gender: bool().required('Gender is missing'),
  dob: date().required('Date is missing'),
  height: number().required('Height is missing').min(0),
  weight: number().required('Weight is missing').min(0),
});

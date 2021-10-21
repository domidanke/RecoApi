import {object, SchemaOf, string} from '../../functions/node_modules/yup';

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

export interface CreateUserPayload {
  authId: string;
  userName: string;
  email: string;
}

const createUserPayloadSchema: SchemaOf<CreateUserPayload> = object({
  authId: string().required('Create User AuthId is missing'),
  userName: string().required('Create User Username is missing'),
  email: string().required('Create User Email is missing'),
});

export default createUserPayloadSchema;

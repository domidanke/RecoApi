import {bool, date, number, object, SchemaOf, string} from 'yup';

export interface RegisterUserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: Date;
  height: number;
  weight: number;
}

export const registerUserPayloadSchema: SchemaOf<RegisterUserPayload> = object({
  id: string().required('Id is missing'),
  email: string().required('Email is missing'),
  firstName: string().required('Firstname is missing'),
  lastName: string().required('Lastname is missing'),
  gender: bool().required('Gender is missing'),
  dob: date().required('Date is missing'),
  height: number()
    .required('Height is missing')
    .min(0, 'Height should be at least 0'),
  weight: number()
    .required('Weight is missing')
    .min(0, 'Weight should be at least 0'),
});

import {date, number, object, SchemaOf, string} from 'yup';

export interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date;
  height?: number;
  weight?: number;
}

export const registerUserPayloadSchema: SchemaOf<RegisterUserPayload> = object({
  firstName: string().required('Firstname is missing'),
  lastName: string().required('Lastname is missing'),
  gender: string().required('Gender is missing'),
  dob: date().required('Date is missing'),
  height: number().optional().min(0, 'Height should be at least 0'),
  weight: number().optional().min(0, 'Weight should be at least 0'),
});

import {SchemaOf, object, string} from 'yup';

export interface SportCode {
  id?: string;
  code: string;
  desc: string;
}

const sportCodeSchema: SchemaOf<SportCode> = object({
  id: string(),
  code: string().required('Sport Code Code is missing'),
  desc: string().required('Sport Code Description is missing'),
});

export default sportCodeSchema;

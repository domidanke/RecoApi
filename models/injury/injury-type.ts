import { object, SchemaOf, string } from '../../functions/node_modules/yup';

export interface InjuryType {
  id?: string;
  code: string;
  desc: string;
  bodyPartCode: string;
  details: string;
}

const injuryTypeSchema: SchemaOf<InjuryType> = object({
  id: string(),
  code: string().required('Injury Type Code is missing'),
  desc: string().required('Injury Type Desc is missing'),
  bodyPartCode: string().required('Injury Type Body Part Code is missing'),
  details: string().required('Injury Type Details is missing'),
});

export default injuryTypeSchema;

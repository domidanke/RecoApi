import {object, SchemaOf, string} from '../../functions/node_modules/yup';

export interface BodyPart {
  id?: string;
  code: string;
  desc: string;
}

const bodyPartSchema: SchemaOf<BodyPart> = object({
  id: string(),
  code: string().required('Body Part Code is missing'),
  desc: string().required('Body Part Desc is missing'),
});

export default bodyPartSchema;

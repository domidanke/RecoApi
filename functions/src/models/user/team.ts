import {object, SchemaOf, string} from 'yup';
import {SportCode} from '../sportcode/sport-code';

export interface Team {
  id: string;
  admins: string[];
  creatorId: string;
  createdDate: Date;
  name: string;
  sportCode: SportCode;
}

export interface NewTeamRegistration {
  creatorId: string;
  id?: string;
  name: string;
  sportCode: SportCode;
}

const newTeamRegistrationSchema: SchemaOf<NewTeamRegistration> = object({
  creatorId: string().required('CreatorId is missing'),
  id: string(),
  name: string().required('Team Name is missing'),
  sportCode: object({
    id: string(),
    code: string().required('Sport Code is missing'),
    desc: string().required('Sport Code Description is missing'),
  }),
});

export default newTeamRegistrationSchema;

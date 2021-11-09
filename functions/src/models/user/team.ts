import {object, SchemaOf, string} from 'yup';

export interface Team {
  id: string;
  admins: string[];
  creatorId: string;
  name: string;
  sportCode: string;
  createdDate: Date;
}

export interface NewTeamRegistration {
  name: string;
  sportCode: string;
}

const newTeamRegistrationSchema: SchemaOf<NewTeamRegistration> = object({
  name: string().required('Team Name is missing'),
  sportCode: string().required('Sport Code is missing'),
});

export default newTeamRegistrationSchema;

import {object, SchemaOf, string} from 'yup';

export interface CreateTeamPayload {
  name: string;
  sportCode: string;
}

const createTeamPayloadSchema: SchemaOf<CreateTeamPayload> = object({
  name: string().required('Team Name is missing'),
  sportCode: string().required('Sport Code is missing'),
});

export default createTeamPayloadSchema;

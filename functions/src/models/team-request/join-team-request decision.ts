import {bool, object, SchemaOf, string} from 'yup';

export interface JoinTeamRequestDecisionPayload {
  id: string;
  requesterId: string;
  accepted: boolean;
  teamMemberTypeCode?: string;
}

const jtrDecisionSchema: SchemaOf<JoinTeamRequestDecisionPayload> = object({
  id: string().required('Join-Request Id is missing'),
  requesterId: string().required('Requester Id is missing'),
  accepted: bool().required('Decision is missing'),
  teamMemberTypeCode: string(),
});

export default jtrDecisionSchema;

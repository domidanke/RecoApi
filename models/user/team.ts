import { TeamMemberDto } from "./team-member";

export interface Team {
    id: number;
    name: string;
    createdDate: Date;
    teamMembers: TeamMemberDto[];
}
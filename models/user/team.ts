import { TeamMember } from "./team-member";

export interface Team {
    id: number;
    name: string;
    createdDate: Date;
    teamMembers: TeamMember[];
}
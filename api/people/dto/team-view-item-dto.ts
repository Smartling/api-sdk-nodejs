import { AgencyDto } from "./agency-dto";
import { TeamViewRoleDto } from "./team-view-role-dto";
import { PeopleLocalePairDto } from "./people-locale-pair-dto";
import { ActionStateDto } from "./action-state-dto";

interface TeamViewItemDto {
    userUid: string;
    firstName: string;
    lastName: string;
    email: string;
    lastLogin: Date | null;
    payable: boolean | null;
    pending: boolean | null;
    agency: AgencyDto | null;
    userRoles: Array<TeamViewRoleDto>;
    containsAllLocales: boolean;
    workflowStepCount: number | null;
    localePairs: Array<PeopleLocalePairDto> | null;
    runningActions: Array<ActionStateDto> | null;
}

export { TeamViewItemDto };

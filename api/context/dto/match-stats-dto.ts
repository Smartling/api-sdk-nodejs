import { BindingDetailsDto } from "./binding/binding-details-dto";
import { MatchStatus } from "../params/match-status";

interface MatchStatsDto {
    matchId: string;
    contextId?: string;
    status: MatchStatus;
    createdDate: Date;
    modifiedDate: Date;
    bindings?: Array<BindingDetailsDto>;
}

export { MatchStatsDto };

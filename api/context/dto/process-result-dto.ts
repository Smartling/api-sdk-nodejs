import { BindingDetailsDto } from "./binding/binding-details-dto";
import { ContextProcessState } from "../params/context-process-state";
import { ProcessType } from "../params/process-type";

interface MatchProcessResultDto {
    contextUid: string;
    checkedStringsCount: number;
    bindings: Array<BindingDetailsDto>;
}

interface ProcessResultDto {
    processUid: string;
    processState: ContextProcessState;
    processType: ProcessType;
    createdDate: Date;
    modifiedDate: Date;
    errorMessage?: string;
    result?: MatchProcessResultDto | Record<string, never>;
}

export { MatchProcessResultDto, ProcessResultDto };

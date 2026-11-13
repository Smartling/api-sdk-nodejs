import { ContextProcessState } from "../params/context-process-state";
import { ProcessType } from "../params/process-type";
import { MatchProcessResultDto } from "./match-process-result-dto";
import { DeleteProcessResultDto } from "./delete-process-result-dto";

interface ProcessResultBase {
    processUid: string;
    processState: ContextProcessState;
    createdDate: Date;
    modifiedDate: Date;
    errorMessage?: string;
}

type ProcessResultDto = ProcessResultBase & (
    | { processType: ProcessType.MATCH_CONTEXT; result?: MatchProcessResultDto }
    | { processType: ProcessType.DELETE_CONTEXTS; result?: DeleteProcessResultDto }
);

export { ProcessResultDto };

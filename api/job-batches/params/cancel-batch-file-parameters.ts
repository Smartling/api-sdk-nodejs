import { BatchAction } from "./batch-action";
import { ProcessBatchActionParameters } from "./process-batch-action-parameters";

export class CancelBatchFileParameters extends ProcessBatchActionParameters {
    constructor(parameters: Record<string, any> = {}) {
        super(parameters);

        this.setAction(BatchAction.CANCEL_FILE);
    }
}

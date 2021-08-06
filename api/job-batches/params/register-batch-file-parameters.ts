import { BatchAction } from "./batch-action";
import { ProcessBatchActionParameters } from "./process-batch-action-parameters";

export class RegisterBatchFileParameters extends ProcessBatchActionParameters {
    constructor(parameters: Record<string, any> = {}) {
        super(parameters);

        this.setAction(BatchAction.REGISTER_FILE);
    }
}

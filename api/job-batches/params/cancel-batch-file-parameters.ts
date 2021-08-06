/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { BatchAction } from "./batch-action";
import { ProcessBatchActionParameters } from "./process-batch-action-parameters";

export class CancelBatchFileParameters extends ProcessBatchActionParameters {
    constructor(parameters: Record<string, any> = {}) {
        super(parameters);

        this.set("action", BatchAction.CANCEL_FILE);
    }

    setReason(reason: string): ProcessBatchActionParameters {
        this.set("reason", reason);

        return this;
    }
}

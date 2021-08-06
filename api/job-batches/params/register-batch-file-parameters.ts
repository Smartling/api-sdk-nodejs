/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { BatchAction } from "./batch-action";
import { ProcessBatchActionParameters } from "./process-batch-action-parameters";

export class RegisterBatchFileParameters extends ProcessBatchActionParameters {
    constructor(parameters: Record<string, any> = {}) {
        super(parameters);

        this.set("action", BatchAction.REGISTER_FILE);
    }
}

import { BaseParameters } from "../../parameters/index";
import { BatchAction } from "./batch-action";

export class ProcessBatchActionParameters extends BaseParameters {
    setAction(action: BatchAction): ProcessBatchActionParameters {
        this.set("action", action);

        return this;
    }

    setFileUri(fileUri: string): ProcessBatchActionParameters {
        this.set("fileUri", fileUri);

        return this;
    }

    setReason(reason: string): ProcessBatchActionParameters {
        this.set("reason", reason);

        return this;
    }
}

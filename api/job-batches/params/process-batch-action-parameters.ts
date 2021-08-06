import { BaseParameters } from "../../parameters/index";
import { BatchAction } from "./batch-action";

export class ProcessBatchActionParameters extends BaseParameters {
    setFileUri(fileUri: string): ProcessBatchActionParameters {
        this.set("fileUri", fileUri);

        return this;
    }
}

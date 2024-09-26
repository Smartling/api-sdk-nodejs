import { BaseParameters } from "../../parameters/index";

export class ProcessBatchActionParameters extends BaseParameters {
    setFileUri(fileUri: string): ProcessBatchActionParameters {
        this.set("fileUri", fileUri);

        return this;
    }
}

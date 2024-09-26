import { BaseParameters } from "../../parameters";

export class ProcessBatchActionParameters extends BaseParameters {
    setFileUri(fileUri: string): ProcessBatchActionParameters {
        this.set("fileUri", fileUri);

        return this;
    }
}

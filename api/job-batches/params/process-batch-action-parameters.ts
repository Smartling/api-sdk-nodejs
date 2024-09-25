import { BaseParameters } from "../../parameters";

export class ProcessBatchActionParameters extends BaseParameters {
    setFileUri(fileUri: string): this {
        this.set("fileUri", fileUri);

        return this;
    }
}

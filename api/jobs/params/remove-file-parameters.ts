import { BaseParameters } from "../../parameters";

export class RemoveFileParameters extends BaseParameters {
    setFileUri(fileUri: string): RemoveFileParameters {
        this.set("fileUri", fileUri);

        return this;
    }
}

import { BaseParameters } from "../../parameters";

export class RemoveFileParameters extends BaseParameters {
    setFileUri(fileUri: string) {
        this.set("fileUri", fileUri);

        return this;
    }
}

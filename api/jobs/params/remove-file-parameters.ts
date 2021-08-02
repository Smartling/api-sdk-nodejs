import { BaseParameters } from "../../parameters";

export class RemoveFileParameters extends BaseParameters {
    setFileUri(fileUri) {
        this.set("fileUri", fileUri);

        return this;
    }
}

import { BaseParameters } from "../../parameters/index";

export class AddFileParameters extends BaseParameters {
    setFileUri(fileUri: string): AddFileParameters {
        this.set("fileUri", fileUri);

        return this;
    }
}

import { BaseParameters } from "../../parameters";

export class FileProgressParameters extends BaseParameters {
    setFileUri(fileUri) {
        this.set("fileUri", fileUri);

        return this;
    }
}

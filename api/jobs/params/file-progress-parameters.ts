import { BaseParameters } from "../../parameters";

export class FileProgressParameters extends BaseParameters {
    setFileUri(fileUri: string) {
        this.set("fileUri", fileUri);

        return this;
    }
}

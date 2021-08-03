import { BaseParameters } from "../../parameters";

export class FileProgressParameters extends BaseParameters {
    setFileUri(fileUri: string): FileProgressParameters {
        this.set("fileUri", fileUri);

        return this;
    }
}

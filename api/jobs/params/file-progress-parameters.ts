import { BaseParameters } from "../../parameters/index";

export class FileProgressParameters extends BaseParameters {
    setFileUri(fileUri: string): FileProgressParameters {
        this.set("fileUri", fileUri);

        return this;
    }
}

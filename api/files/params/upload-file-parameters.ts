import { BaseParameters } from "../../parameters/index";

export class UploadFileParameters extends BaseParameters {
    setDirective(key: string, value: string) {
        this.set(`smartling.${key}`, value);

        return this;
    }

    setFile(file: string) {
        this.set("file", file);
        return this;
    }

    setFileType(fileType: string) {
        this.set("fileType", fileType);
        return this;
    }

    setFileUri(fileUri: string) {
        this.set("fileUri", fileUri);
        return this;
    }
}

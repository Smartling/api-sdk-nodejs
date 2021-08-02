import { BaseParameters } from "../../parameters/index";

export class UploadFileParameters extends BaseParameters {
    setDirective(key, value) {
        this.set(`smartling.${key}`, value);

        return this;
    }

    setFile(file) {
        this.set("file", file);
        return this;
    }

    setFileType(fileType) {
        this.set("fileType", fileType);
        return this;
    }

    setFileUri(fileUri) {
        this.set("fileUri", fileUri);
        return this;
    }
}

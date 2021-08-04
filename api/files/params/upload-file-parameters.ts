import { BaseParameters } from "../../parameters/index";

export class UploadFileParameters extends BaseParameters {
    setDirective(key: string, value: string): UploadFileParameters {
        this.set(`smartling.${key}`, value);

        return this;
    }

    setFile(file: string): UploadFileParameters {
        this.set("file", file);
        return this;
    }

    setFileType(fileType: string): UploadFileParameters {
        this.set("fileType", fileType);
        return this;
    }

    setFileUri(fileUri: string): UploadFileParameters {
        this.set("fileUri", fileUri);
        return this;
    }
}

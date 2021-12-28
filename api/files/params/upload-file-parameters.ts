import * as fs from "fs";
import { BaseParameters } from "../../parameters/index";
import { FileType } from "./file-type";

export class UploadFileParameters extends BaseParameters {
    setDirective(key: string, value: string): UploadFileParameters {
        this.set(`smartling.${key}`, value);

        return this;
    }

    setFile(file: string): UploadFileParameters {
        this.set("file", fs.createReadStream(
            fs.realpathSync(file)
        ));
        return this;
    }

    setFileType(fileType: FileType): UploadFileParameters {
        this.set("fileType", fileType);
        return this;
    }

    setFileUri(fileUri: string): UploadFileParameters {
        this.set("fileUri", fileUri);
        return this;
    }
}

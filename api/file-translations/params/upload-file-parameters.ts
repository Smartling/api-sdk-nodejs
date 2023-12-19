import * as fs from "fs";
import string2fileStream from "string-to-file-stream";
import { BaseParameters } from "../../parameters";
import { FileType } from "../../files/params/file-type";

export class UploadFileParameters extends BaseParameters {
    constructor(parameters: Record<string, unknown> = {}) {
        super(parameters);

        this.set("request", {});
    }

    setFileFromLocalFilePath(filePath: string): UploadFileParameters {
        this.set("file", fs.createReadStream(
            fs.realpathSync(filePath)
        ));
        return this;
    }

    setFileContent(fileContent: string): UploadFileParameters {
        this.set("file", string2fileStream(fileContent));
        return this;
    }

    setFileType(fileType: FileType): UploadFileParameters {
        this.parameters.request.fileType = fileType.toUpperCase();
        return this;
    }
}

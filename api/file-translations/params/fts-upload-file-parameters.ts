import * as fs from "fs";
import string2fileStream from "string-to-file-stream";
import { BaseParameters } from "../../parameters";
import { FileType } from "../../files/params/file-type";

export class FtsUploadFileParameters extends BaseParameters {
    constructor(parameters: Record<string, unknown> = {}) {
        super(parameters);

        this.set("request", {});
    }

    setFileFromLocalFilePath(filePath: string): FtsUploadFileParameters {
        this.set("file", fs.createReadStream(
            fs.realpathSync(filePath)
        ));
        return this;
    }

    setFileContent(fileContent: string): FtsUploadFileParameters {
        this.set("file", string2fileStream(fileContent));
        return this;
    }

    setFileContentFromBuffer(fileContent: Buffer): FtsUploadFileParameters {
        this.set("file", fileContent);
        return this;
    }

    setFileName(fileName: string): FtsUploadFileParameters {
        this.set("fileName", fileName);
        return this;
    }

    setFileContentType(contentType: string): FtsUploadFileParameters {
        this.set("contentType", contentType);
        return this;
    }

    setFileType(fileType: FileType): FtsUploadFileParameters {
        this.parameters.request.fileType = fileType.toUpperCase();
        return this;
    }
}

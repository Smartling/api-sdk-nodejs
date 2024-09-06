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

    setFileType(fileType: FileType): FtsUploadFileParameters {
        this.parameters.request.fileType = fileType.toUpperCase();
        return this;
    }

    addDirective(instruction: string, value: string): FtsUploadFileParameters {
        if (!this.parameters.request.parseConfigItems) {
            this.parameters.request.parseConfigItems = [];
        }

        this.parameters.request.parseConfigItems = this.parameters.request.parseConfigItems.concat({
            instruction,
            value
        });

        return this;
    }
}

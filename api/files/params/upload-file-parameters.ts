import * as fs from "fs";
import { Readable } from "stream";
import { BaseParameters } from "../../parameters/index";
import { FileType } from "./file-type";

export class UploadFileParameters extends BaseParameters {
    setDirective(key: string, value: string): UploadFileParameters {
        this.set(`smartling.${key}`, value);

        return this;
    }

    /**
     * @deprecated This method will be deleted in 2.0.0
     * @param filePath
     * @returns UploadFileParameters
     */
    setFile(filePath: string): UploadFileParameters {
        this.set("file", fs.createReadStream(
            fs.realpathSync(filePath)
        ));
        return this;
    }

    setFileFromLocalFilePath(filePath: string): UploadFileParameters {
        this.set("file", fs.createReadStream(
            fs.realpathSync(filePath)
        ));
        return this;
    }

    async setFileContent(fileContent: Readable): Promise<UploadFileParameters> {
        this.set("file", await BaseParameters.readableStreamToFileStream(fileContent));

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

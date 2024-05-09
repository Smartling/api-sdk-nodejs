import * as fs from "fs";
import string2fileStream from "string-to-file-stream";
import { BaseParameters } from "../../parameters/index";
import { FileType } from "./file-type";
import { SmartlingException } from "../../exception";

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

    setFileContent(fileContent: string): UploadFileParameters {
        this.set("file", string2fileStream(fileContent));

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

    setCallbackUrl(callbackUrl: string): UploadFileParameters {
        if (callbackUrl && (callbackUrl.length > 255)) {
            throw new SmartlingException("File callback URL should be not greater than 255 characters.");
        }

        this.set("callbackUrl", callbackUrl);

        return this;
    }
}

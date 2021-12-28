import string2fileStream from "string-to-file-stream";
import { UploadBatchFileParameters } from "./upload-batch-file-parameters";

export class UploadBatchFileStringParameters extends UploadBatchFileParameters {
    setFile(fileContents: string): UploadBatchFileParameters {
        this.set("file", string2fileStream(fileContents));

        return this;
    }
}

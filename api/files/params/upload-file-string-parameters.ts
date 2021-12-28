import string2fileStream from "string-to-file-stream";
import { UploadFileParameters } from "./upload-file-parameters";

export class UploadFileStringParameters extends UploadFileParameters {
    setFile(fileContents: string): UploadFileStringParameters {
        this.set("file", string2fileStream(fileContents));
        return this;
    }
}

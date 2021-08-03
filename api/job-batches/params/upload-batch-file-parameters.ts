import { BaseParameters } from "../../parameters";

export class UploadBatchFileParameters extends BaseParameters {
    setClientLibId(clientLibId: string, version: string) {
        this.set("smartling.client_lib_id", JSON.stringify({
            client: clientLibId,
            version
        }));

        return this;
    }

    setCallbackUrl(callbackUrl: string) {
        this.set("callbackUrl", callbackUrl);

        return this;
    }

    setLocalesToApprove(localesToApprove: Array<string>) {
        this.set("localeIdsToAuthorize", localesToApprove);

        return this;
    }

    setFile(filePath: string) {
        this.set("file", filePath);

        return this;
    }

    setFileUri(fileUri: string) {
        this.set("fileUri", fileUri);

        return this;
    }

    setFileType(fileType: string) {
        this.set("fileType", fileType);

        return this;
    }

    setDirective(key: string, value: string) {
        this.set(`smartling.${key}`, value);

        return this;
    }
}

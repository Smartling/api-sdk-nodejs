import { BaseParameters } from "../../parameters";

export class UploadBatchFileParameters extends BaseParameters {
    setClientLibId(clientLibId, version) {
        this.set("smartling.client_lib_id", JSON.stringify({
            client: clientLibId,
            version
        }));

        return this;
    }

    setCallbackUrl(callbackUrl) {
        this.set("callbackUrl", callbackUrl);

        return this;
    }

    setLocalesToApprove(localesToApprove) {
        if (!Array.isArray(localesToApprove)) {
            localesToApprove = [localesToApprove];
        }

        this.set("localeIdsToAuthorize", localesToApprove);

        return this;
    }

    setFile(filePath) {
        this.set("file", filePath);

        return this;
    }

    setFileUri(fileUri) {
        this.set("fileUri", fileUri);

        return this;
    }

    setFileType(fileType) {
        this.set("fileType", fileType);

        return this;
    }

    setDirective(key, value) {
        this.set(`smartling.${key}`, value);

        return this;
    }
}

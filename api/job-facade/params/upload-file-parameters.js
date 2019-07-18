const BaseParameters = require("../../parameters/index");

class UploadFileParameters extends BaseParameters {
    setClientLibId(clientLibId, version) {
        this.set("smartling.client_lib_id", JSON.stringify({
            client: clientLibId,
            version: version
        }));

        return this;
    }

    setCallbackUrl(callback_url) {
        this.set("callbackUrl", callback_url);

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
}

module.exports = UploadFileParameters;

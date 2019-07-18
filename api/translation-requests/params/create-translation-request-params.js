const BaseTranslationRequestParameters = require("./base-translation-request-parameters");

class CreateTranslationRequestParameters extends BaseTranslationRequestParameters {
    setTranslationRequestUid(translationRequestUid) {
        this.set("translationRequestUid", translationRequestUid);

        return this;
    }

    setOriginalAssetKey(originalAssetKey = []) {
        this.set("originalAssetKey", originalAssetKey);

        return this;
    }

    setFileUri(fileUri) {
        this.set("fileUri", fileUri);

        return this;
    }

    setOriginalLocaleId(originalLocaleId) {
        this.set("originalLocaleId", originalLocaleId);

        return this;
    }

    addTranslationSubmission(translationSubmission) {
        if (!Object.prototype.hasOwnProperty.call(this.parameters, "translationSubmissions")) {
            this.set("translationSubmissions", []);
        }

        this.parameters.translationSubmissions = this.parameters
            .translationSubmissions.concat(translationSubmission.export());

        return this;
    }
}

module.exports = CreateTranslationRequestParameters;

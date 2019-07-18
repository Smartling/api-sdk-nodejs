const BaseParameters = require("../../parameters");

class SearchTranslationRequestParameters extends BaseParameters {
    setOriginalAssetKey(originalAssetKey = []) {
        this.set("originalAssetKey", JSON.stringify(originalAssetKey));

        return this;
    }

    setFileUri(fileUri) {
        this.set("fileUri", fileUri);

        return this;
    }

    setOutdated(outdated) {
        this.set("outdated", outdated);

        return this;
    }

    setCustomOriginalData(customOriginalData = []) {
        this.set("customOriginalData", JSON.stringify(customOriginalData));

        return this;
    }

    setTargetAssetKey(targetAssetKey = []) {
        this.set("targetAssetKey", JSON.stringify(targetAssetKey));

        return this;
    }

    setTargetLocaleId(targetLocaleId) {
        this.set("targetLocaleId", targetLocaleId);

        return this;
    }

    setState(state) {
        this.set("state", state);

        return this;
    }

    setSubmitterName(submitterName) {
        this.set("submitterName", submitterName);

        return this;
    }

    setCustomTranslationData(customTranslationData = []) {
        this.set("customTranslationData", JSON.stringify(customTranslationData));

        return this;
    }

    setLimit(limit) {
        this.set("limit", limit);
        return this;
    }

    setOffset(offset) {
        this.set("offset", offset);

        return this;
    }

    setTranslationSubmissionUid(translationSubmissionUid) {
        this.set("translationSubmissionUid", translationSubmissionUid);

        return this;
    }

    setWithBatchUid() {
        this.set("withBatchUid", 1);

        return this;
    }

    setWithoutBatchUid() {
        this.set("withoutBatchUid", 1);

        return this;
    }
}

module.exports = SearchTranslationRequestParameters;

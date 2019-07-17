const BaseParameters = require("../../parameters");

class BaseTranslationRequestParameters extends BaseParameters {
    setTargetAssetKey(targetAssetKey = []) {
        this.set("targetAssetKey", targetAssetKey);

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
        this.set("customTranslationData", customTranslationData);

        return this;
    }

    setSubmittedDate(submittedDate) {
        this.set("submittedDate", submittedDate);

        return this;
    }

    setLastExportedDate(lastExportDate) {
        this.set("lastExportedDate", lastExportDate);

        return this;
    }

    setLastErrorMessage(lastErrorMessage) {
        this.set("lastErrorMessage", lastErrorMessage);

        return this;
    }
}

module.exports = BaseTranslationRequestParameters;

const BaseParameters = require("../../parameters");
const SmartlingException = require("../../exception");

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
        if (Object.prototype.toString.call(submittedDate) !== "[object Date]") {
            throw new SmartlingException("Submitted date must be an instance of Date");
        }

        this.set("submittedDate", submittedDate.toISOString());

        return this;
    }

    setLastExportedDate(lastExportDate) {
        if (Object.prototype.toString.call(lastExportDate) !== "[object Date]") {
            throw new SmartlingException("Last export date must be an instance of Date");
        }

        this.set("lastExportedDate", lastExportDate.toISOString());

        return this;
    }

    setLastErrorMessage(lastErrorMessage) {
        this.set("lastErrorMessage", lastErrorMessage);

        return this;
    }
}

module.exports = BaseTranslationRequestParameters;

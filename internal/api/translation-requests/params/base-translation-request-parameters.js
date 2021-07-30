const BaseParameters = require("../../parameters");

class BaseTranslationRequestParameters extends BaseParameters {
    setTitle(title) {
        this.set("title", title);

        return this;
    }

    setContentHash(contentHash) {
        this.set("contentHash", contentHash);

        return this;
    }

    setOutdated(outdated) {
        this.set("outdated", outdated);

        return this;
    }

    setTotalWordCount(totalWordCount) {
        this.set("totalWordCount", totalWordCount);

        return this;
    }

    setTotalStringCount(totalStringCount) {
        this.set("totalStringCount", totalStringCount);

        return this;
    }

    setCustomOriginalData(customOriginalData = []) {
        this.set("customOriginalData", customOriginalData);

        return this;
    }
}

module.exports = BaseTranslationRequestParameters;

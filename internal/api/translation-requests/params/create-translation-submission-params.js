const BaseTranslationSubmissionParameters = require("./base-translation-submission-parameters");

class CreateTranslationSubmissionParameters extends BaseTranslationSubmissionParameters {
    setTranslationRequestUid(translationRequestUid) {
        this.set("translationRequestUid", translationRequestUid);

        return this;
    }

    setTargetLocaleId(targetLocaleId) {
        this.set("targetLocaleId", targetLocaleId);

        return this;
    }
}

module.exports = CreateTranslationSubmissionParameters;

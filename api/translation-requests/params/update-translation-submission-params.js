const BaseTranslationSubmissionParameters = require("./base-translation-submission-parameters");

class UpdateTranslationSubmissionParameters extends BaseTranslationSubmissionParameters {
    setTranslationSubmissionUid(translationSubmissionUid) {
        this.set('translationSubmissionUid', translationSubmissionUid);

        return this;
    }
}

module.exports = UpdateTranslationSubmissionParameters;

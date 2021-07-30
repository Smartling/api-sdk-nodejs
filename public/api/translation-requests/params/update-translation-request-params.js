const BaseTranslationRequestParameters = require("./base-translation-request-parameters");

class UpdateTranslationRequestParameters extends BaseTranslationRequestParameters {
    addTranslationSubmission(translationSubmission) {
        if (!Object.prototype.hasOwnProperty.call(this.parameters, "translationSubmissions")) {
            this.set("translationSubmissions", []);
        }

        this.parameters.translationSubmissions = this.parameters
            .translationSubmissions.concat(translationSubmission.export());

        return this;
    }
}

module.exports = UpdateTranslationRequestParameters;

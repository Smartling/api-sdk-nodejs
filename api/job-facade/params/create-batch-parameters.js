const BaseParameters = require("../../parameters/index");

class CreateBatchParameters extends BaseParameters {
    setTranslationJobUid(uid) {
        this.set("translationJobUid", uid);

        return this;
    }

    setAuthorize(authorize) {
        this.set("authorize", authorize);

        return this;
    }

    setCallbackUrl(callbackUrl) {
        this.set("callbackUrl", callbackUrl);

        return this;
    }
}

module.exports = CreateBatchParameters;

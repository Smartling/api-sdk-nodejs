const BaseParameters = require("../../parameters/index");

class RemoveFileParameters extends BaseParameters {
    setFileUri(fileUri) {
        this.set("fileUri", fileUri);

        return this;
    }
}

module.exports = RemoveFileParameters;

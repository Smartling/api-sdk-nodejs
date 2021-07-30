const BaseParameters = require("../../parameters/index");

class FileProgressParameters extends BaseParameters {
    setFileUri(fileUri) {
        this.set("fileUri", fileUri);

        return this;
    }
}

module.exports = FileProgressParameters;

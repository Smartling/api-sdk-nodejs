const BaseParameters = require("../../parameters/index");

class UploadFileParameters extends BaseParameters {
    setDirectives(directives) {
        this.set("directives", directives);
        return this;
    }

    setFile(file) {
        this.set("file", file);
        return this;
    }

    setFileType(fileType) {
        this.set("fileType", fileType);
        return this;
    }

    setFileUri(fileUri) {
        this.set("fileUri", fileUri);
        return this;
    }

    setNamespace(namespace) {
        this.set("namespace", namespace);
        return this;
    }
}

module.exports = UploadFileParameters;

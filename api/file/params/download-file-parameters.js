const BaseParameters = require("../../parameters/index");
const RetrievalTypes = require("./retrieval-types");
const SmartlingException = require("../../exception");

class DownloadFileParameters extends BaseParameters {
    enableDebugMode() {
        this.set("debugMode", 1);

        return this;
    }

    setRetrievalType(retrievalType) {
        if (!Object.prototype.hasOwnProperty.call(RetrievalTypes, retrievalType)) {
            throw new SmartlingException(`Unknown retrieval type: ${retrievalType}`);
        }

        this.set("retrievalType", retrievalType);

        return this;
    }
}

module.exports = DownloadFileParameters;

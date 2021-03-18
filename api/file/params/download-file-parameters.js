const BaseParameters = require("../../parameters/index");
const RetrievalTypes = require("./retrieval-types");
const SmartlingException = require("../../exception");

class DownloadFileParameters extends BaseParameters {
    setRetrievalType(retrievalType) {
        if (!Object.prototype.hasOwnProperty.call(RetrievalTypes, retrievalType)) {
            throw new SmartlingException(`Unknown retrieval type: ${retrievalType}`);
        }

        this.set("retrievalType", retrievalType);

        return this;
    }

    setDebugMode(debugMode) {
        this.set("debugMode", debugMode);

        return this;
    }
}

module.exports = DownloadFileParameters;

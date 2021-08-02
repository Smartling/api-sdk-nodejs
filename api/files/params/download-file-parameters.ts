import { BaseParameters } from "../../parameters";
import { RetrievalType } from "./retrieval-type";

export class DownloadFileParameters extends BaseParameters {
    enableDebugMode() {
        this.set("debugMode", 1);

        return this;
    }

    setRetrievalType(retrievalType: RetrievalType) {
        this.set("retrievalType", retrievalType);

        return this;
    }
}

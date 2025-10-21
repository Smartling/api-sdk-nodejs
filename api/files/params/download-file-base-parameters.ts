import { BaseParameters } from "../../parameters/index";
import { RetrievalType } from "./retrieval-type";

export class DownloadFileBaseParameters extends BaseParameters {
    setRetrievalType(retrievalType: RetrievalType): this {
        this.set("retrievalType", retrievalType);

        return this;
    }

    includeOriginalStrings(): this {
        this.set("includeOriginalStrings", true);

        return this;
    }

    excludeOriginalStrings(): this {
        this.set("includeOriginalStrings", false);

        return this;
    }
}

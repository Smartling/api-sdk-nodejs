import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

export class DeleteContextsAsyncParameters extends BaseParameters {
    setContextUids(contextUids: Array<string>): DeleteContextsAsyncParameters {
        if (contextUids.length > 100) {
            throw new SmartlingException("Cannot delete more than 100 contexts at once");
        }
        this.set("contextUids", contextUids);

        return this;
    }
}

import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

// API-enforced limit on /contexts/remove/async.
const MAX_CONTEXT_UIDS_PER_DELETE = 100;

export class DeleteContextsAsyncParameters extends BaseParameters {
    setContextUids(contextUids: Array<string>): DeleteContextsAsyncParameters {
        if (contextUids.length > MAX_CONTEXT_UIDS_PER_DELETE) {
            throw new SmartlingException(
                `Cannot delete more than ${MAX_CONTEXT_UIDS_PER_DELETE} contexts at once, got ${contextUids.length}`
            );
        }
        this.set("contextUids", [...contextUids]);

        return this;
    }
}

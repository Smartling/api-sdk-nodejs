import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

export class FetchSourceStringsParameters extends BaseParameters {
    setHashCodes(hashCodes: string[]): FetchSourceStringsParameters {
        this.set("hashcodes", hashCodes);

        return this;
    }

    setFileUri(fileUri: string): FetchSourceStringsParameters {
        this.set("fileUri", fileUri);

        return this;
    }

    setLimit(limit: number): FetchSourceStringsParameters {
        if (limit < 0) {
            throw new SmartlingException("Limit parameter cannot be a negative number");
        }
        this.set("limit", limit);

        return this;
    }

    setOffset(offset: number): FetchSourceStringsParameters {
        if (offset < 0) {
            throw new SmartlingException("Offset parameter cannot be a negative number");
        }
        this.set("offset", offset);

        return this;
    }
}

import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class SearchStringTagsParameters extends BaseParameters {
    setStringHashcodes(stringHashcodes: Array<string>): SearchStringTagsParameters {
        if (!stringHashcodes || stringHashcodes.length === 0) {
            throw new SmartlingException("String hashcodes array is required");
        }

        if (stringHashcodes.length > 1000) {
            throw new SmartlingException("String hashcodes array must not exceed 1000 items");
        }

        this.set("stringHashcodes", stringHashcodes);

        return this;
    }
}

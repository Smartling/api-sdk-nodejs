import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export abstract class BaseTagsStringsParameters<
    T extends BaseTagsStringsParameters<T>
> extends BaseParameters {
    setTags(tags: Array<string>): T {
        if (!tags || tags.length === 0) {
            throw new SmartlingException("Tags array is required");
        }

        if (tags.length > 100) {
            throw new SmartlingException("Tags array must not exceed 100 items");
        }

        tags.forEach((tag) => {
            if (tag.length > 128) {
                throw new SmartlingException("Tag length must not exceed 128 characters");
            }
        });

        this.set("tags", tags);

        return this as unknown as T;
    }

    setStringHashcodes(stringHashcodes: Array<string>): T {
        if (!stringHashcodes || stringHashcodes.length === 0) {
            throw new SmartlingException("String hashcodes array is required");
        }

        if (stringHashcodes.length > 1000) {
            throw new SmartlingException("String hashcodes array must not exceed 1000 items");
        }

        this.set("stringHashcodes", stringHashcodes);

        return this as unknown as T;
    }
}

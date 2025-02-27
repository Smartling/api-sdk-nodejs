import { SmartlingException } from "../../exception";
import { BaseParameters } from "../../parameters";
import { SourceTextItem } from "./source-text-item";

const MAX_ALLOWED_SOURCE_ITEMS = 1000;
const MAX_ALLOWED_KEY_LENGTH = 255;
const MAX_ALLOWED_SOURCE_TEXT_LENGTH = 64 * 1024;

export class SmartlingMTParameters extends BaseParameters {
    constructor(sourceLocaleId: string, targetLocaleId: string, items: SourceTextItem[]) {
        super();

        if (!items.length) {
            throw new SmartlingException("At least one source text item is required.");
        }

        if (items.length > MAX_ALLOWED_SOURCE_ITEMS) {
            throw new SmartlingException(`The request contains too many source text items: ${items.length}. Maximum allowed items number is ${MAX_ALLOWED_SOURCE_ITEMS}.`);
        }

        items.forEach((sourceTextItem, index) => {
            if (!sourceTextItem.key.length) {
                throw new SmartlingException(`The key is requred for items[${index}].`);
            }
            if (sourceTextItem.key.length > MAX_ALLOWED_KEY_LENGTH) {
                throw new SmartlingException(`The key is too long for items[${index}]: ${sourceTextItem.key.length}. Maximum allowed key length is ${MAX_ALLOWED_KEY_LENGTH}.`);
            }
            if (!sourceTextItem.sourceText.length) {
                throw new SmartlingException(`The source text is requred for items[${index}].`);
            }
            if (sourceTextItem.sourceText.length > MAX_ALLOWED_SOURCE_TEXT_LENGTH) {
                throw new SmartlingException(`The source text is too long for items[${index}]: ${sourceTextItem.sourceText.length}. Maximum allowed source text length is ${MAX_ALLOWED_SOURCE_TEXT_LENGTH}.`);
            }
        });

        this.set("sourceLocaleId", sourceLocaleId);
        this.set("targetLocaleId", targetLocaleId);
        this.set("items", items);
    }
}

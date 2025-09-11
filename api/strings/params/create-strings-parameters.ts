import { BaseParameters } from "../../parameters/index";
import { StringItemParameters } from "./string-item-parameters";

export class CreateStringsParameters extends BaseParameters {
    public setNamespace(namespace: string): CreateStringsParameters {
        this.set("namespace", namespace);
        return this;
    }

    public setPlaceholderFormat(placeholderFormat: string): CreateStringsParameters {
        this.set("placeholderFormat", placeholderFormat);
        return this;
    }

    public setPlaceholderFormatCustom(placeholderFormatCustom: string): CreateStringsParameters {
        this.set("placeholderFormatCustom", placeholderFormatCustom);
        return this;
    }

    public setStrings(strings: StringItemParameters[]): CreateStringsParameters {
        if (strings.length > 100) {
            throw new Error("Maximum 100 strings can be posted in any given request");
        }
        this.set("strings", strings);
        return this;
    }

    public addString(stringItem: StringItemParameters): CreateStringsParameters {
        const currentStrings: StringItemParameters[] = this.parameters.strings || [];
        if (currentStrings.length >= 100) {
            throw new Error("Maximum 100 strings can be posted in any given request");
        }
        this.set("strings", [...currentStrings, stringItem]);
        return this;
    }
}

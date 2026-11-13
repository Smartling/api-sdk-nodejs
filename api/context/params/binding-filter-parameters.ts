import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

export abstract class BindingFilterParameters extends BaseParameters {
    protected static readonly FILTER_KEYS = ["stringHashcodes", "contentFileUri", "contextUid", "bindingUids"];

    protected static describeFilterKeys(): string {
        const keys = BindingFilterParameters.FILTER_KEYS;

        return `${keys.slice(0, -1).join(", ")} or ${keys[keys.length - 1]}`;
    }

    setStringHashcodes(stringHashcodes: Array<string>): this {
        this.set("stringHashcodes", [...stringHashcodes]);

        return this;
    }

    setContentFileUri(contentFileUri: string): this {
        this.set("contentFileUri", contentFileUri);

        return this;
    }

    setContextUid(contextUid: string): this {
        this.set("contextUid", contextUid);

        return this;
    }

    setBindingUids(bindingUids: Array<string>): this {
        this.set("bindingUids", [...bindingUids]);

        return this;
    }

    export(): Record<string, unknown> {
        const exported = super.export();
        const setFilterCount = BindingFilterParameters.FILTER_KEYS
            .filter((key) => BindingFilterParameters.isFilterValueSet(exported[key]))
            .length;

        if (setFilterCount > 1) {
            throw new SmartlingException(
                `Only one of ${BindingFilterParameters.describeFilterKeys()} may be set`
            );
        }

        return exported;
    }

    protected static hasAnyFilterSet(exported: Record<string, unknown>): boolean {
        return BindingFilterParameters.FILTER_KEYS
            .some((key) => BindingFilterParameters.isFilterValueSet(exported[key]));
    }

    private static isFilterValueSet(value: unknown): boolean {
        if (Array.isArray(value)) {
            return value.length > 0;
        }

        if (typeof value === "string") {
            return value.trim().length > 0;
        }

        return value !== undefined && value !== null;
    }
}

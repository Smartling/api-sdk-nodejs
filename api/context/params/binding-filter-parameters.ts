import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

export abstract class BindingFilterParameters extends BaseParameters {
    // Mirrors BindingOperationsFactory.validate() on the backend: exactly one of these may
    // be set, and an empty array/string counts as not set there (CollectionUtils/StringUtils
    // .isEmpty), matched here by isFilterValueSet().
    private static readonly FILTER_KEYS = ["stringHashcodes", "contentFileUri", "contextUid", "bindingUids"];

    setStringHashcodes(stringHashcodes: Array<string>): this {
        this.set("stringHashcodes", stringHashcodes);

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
        this.set("bindingUids", bindingUids);

        return this;
    }

    export(): Record<string, unknown> {
        const exported = super.export();
        const setFilterCount = BindingFilterParameters.FILTER_KEYS
            .filter((key) => BindingFilterParameters.isFilterValueSet(exported[key]))
            .length;

        if (setFilterCount > 1) {
            throw new SmartlingException(
                "Only one of stringHashcodes, contentFileUri, contextUid or bindingUids may be set"
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
            return value.length > 0;
        }

        return value !== undefined;
    }
}

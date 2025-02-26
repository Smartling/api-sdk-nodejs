import { BaseParametersWithCallback } from "./base-parameters-with-callback";

export class TranslateFileParameters extends BaseParametersWithCallback {
    setSourceLocaleId(sourceLocaleId: string): TranslateFileParameters {
        this.set("sourceLocaleId", sourceLocaleId);
        return this;
    }

    setTargetLocaleIds(targetLocaleIds: string[]): TranslateFileParameters {
        this.set("targetLocaleIds", targetLocaleIds);
        return this;
    }
}

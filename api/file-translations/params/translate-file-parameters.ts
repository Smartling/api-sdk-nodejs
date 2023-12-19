import { BaseParameters } from "../../parameters";

export class TranslateFileParameters extends BaseParameters {
    setSourceLocaleId(sourceLocaleId: string): TranslateFileParameters {
        this.set("sourceLocaleId", sourceLocaleId);
        return this;
    }

    setTargetLocaleIds(targetLocaleIds: string[]): TranslateFileParameters {
        this.set("targetLocaleIds", targetLocaleIds);
        return this;
    }
}

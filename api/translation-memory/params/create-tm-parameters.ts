import { BaseParameters } from "../../parameters/index";
import { TranslationQualityType } from "./translation-quality-type";

export class CreateTmParameters extends BaseParameters {
    setName(name: string): CreateTmParameters {
        this.set("name", name);

        return this;
    }

    setDescription(description: string): CreateTmParameters {
        this.set("description", description);

        return this;
    }

    setSourceLocaleId(sourceLocaleId: string): CreateTmParameters {
        this.set("sourceLocaleId", sourceLocaleId);

        return this;
    }

    setTranslationQuality(translationQuality: TranslationQualityType): CreateTmParameters {
        this.set("translationQuality", translationQuality);

        return this;
    }
}

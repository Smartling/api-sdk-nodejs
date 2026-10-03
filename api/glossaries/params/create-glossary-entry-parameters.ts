import { BaseParameters } from "../../parameters/index";
import { PartOfSpeech } from "../enums/part-of-speech";
import { GlossaryTranslationDto } from "../dto/translation-dto";
import { CustomFieldValueDto } from "../dto/custom-field-value-dto";

export class CreateGlossaryEntryParameters extends BaseParameters {
    setDefinition(definition: string): CreateGlossaryEntryParameters {
        this.set("definition", definition);

        return this;
    }

    setPartOfSpeech(partOfSpeech: PartOfSpeech): CreateGlossaryEntryParameters {
        this.set("partOfSpeech", partOfSpeech);

        return this;
    }

    setLabelUids(labelUids: Array<string>): CreateGlossaryEntryParameters {
        this.set("labelUids", labelUids);

        return this;
    }

    setSkipMissingTranslations(skipMissingTranslations: boolean): CreateGlossaryEntryParameters {
        this.set("skipMissingTranslations", skipMissingTranslations);

        return this;
    }

    setTranslations(translations: Array<GlossaryTranslationDto>): CreateGlossaryEntryParameters {
        this.set("translations", translations);

        return this;
    }

    setCustomFieldValues(
        customFieldValues: Array<CustomFieldValueDto>
    ): CreateGlossaryEntryParameters {
        this.set("customFieldValues", customFieldValues);

        return this;
    }

    setSuggestion(suggestion: boolean): CreateGlossaryEntryParameters {
        this.set("suggestion", suggestion);

        return this;
    }
}

import { BaseParameters } from "../../parameters/index";
import { TmSorting } from "./tm-sorting";
import { TranslationQualityType } from "./translation-quality-type";

export class SearchTmsParameters extends BaseParameters {
    setFirst(first: number): SearchTmsParameters {
        this.set("first", first);

        return this;
    }

    setOffset(offset: number): SearchTmsParameters {
        this.set("offset", offset);

        return this;
    }

    setSortBy(sortBy: TmSorting): SearchTmsParameters {
        this.set("sortBy", sortBy);

        return this;
    }

    setSourceLocaleId(sourceLocaleId: string): SearchTmsParameters {
        this.set("sourceLocaleId", sourceLocaleId);

        return this;
    }

    setNameFilter(nameFilter: string): SearchTmsParameters {
        this.set("nameFilter", nameFilter);

        return this;
    }

    setSourceLanguageId(sourceLanguageId: string): SearchTmsParameters {
        this.set("sourceLanguageId", sourceLanguageId);

        return this;
    }

    setTranslationQuality(translationQuality: TranslationQualityType): SearchTmsParameters {
        this.set("translationQuality", translationQuality);

        return this;
    }
}

import { UserDto } from "./user-dto";
import { TmLocaleDto } from "./tm-locale-dto";
import { LocaleSummaryDto } from "./locale-summary-dto";
import { TranslationQualityType } from "../params/translation-quality-type";

interface TmDto {
    tmUid?: string | null;
    name: string;
    description?: string | null;
    sourceLocaleId: string;
    sourceLocale: TmLocaleDto;
    creator: UserDto;
    created: Date;
    lastModifier: UserDto;
    lastModified: Date;
    localeSummary?: Array<LocaleSummaryDto> | null;
    translationQuality: TranslationQualityType;
    managedWordsEnabled: boolean;
}

export { TmDto };

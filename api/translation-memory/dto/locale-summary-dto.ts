import { TmLocaleDto } from "./tm-locale-dto";

interface LocaleSummaryDto {
    translationLocaleId: string;
    translationLocale: TmLocaleDto;
    stringCount: number;
    wordCount: number;
}

export { LocaleSummaryDto };

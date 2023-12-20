import { MTState } from "./mt-state";
import { Error } from "./error";
import { TranslationLocaleStatusDto } from "./translation-locale-status-dto";

interface TranslationStatusDto {
    state: MTState,
    requestedStringCount: number,
    error?: Error,
    localeProcessStatuses: TranslationLocaleStatusDto[]
}

export { TranslationStatusDto };

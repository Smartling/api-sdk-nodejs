import { MTState } from "./mt-state";
import { Error } from "./error";

interface TranslationLocaleStatusDto {
    localeId: string,
    state: MTState,
    processedStringCount: number,
    error?: Error,
}

export { TranslationLocaleStatusDto };

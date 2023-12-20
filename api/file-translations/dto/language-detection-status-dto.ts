import { Error } from "./error";
import { LanguageDetectionState } from "./language-detection-state";
import { LanguageDto } from "./language-dto";

interface LanguageDetectionStatusDto {
    state: LanguageDetectionState,
    error?: Error,
    detectedSourceLanguages: LanguageDto[]
}

export { LanguageDetectionStatusDto };

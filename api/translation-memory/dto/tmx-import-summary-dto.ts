import { TmxParsingErrorDto } from "./tmx-parsing-error-dto";

interface TmxImportSummaryDto {
    message?: string | null;
    wordCount: number;
    stringCount: number;
    translationMemoryImportErrors?: Array<TmxParsingErrorDto> | null;
    parsingErrors?: Array<TmxParsingErrorDto> | null;
    jobUid: string;
    tmxUid: string;
}

export { TmxImportSummaryDto };

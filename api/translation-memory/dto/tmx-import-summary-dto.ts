import { TmxParsingErrorDto } from "./tmx-parsing-error-dto";

interface TmxImportSummaryDto {
    message: string | null;
    wordCount: number;
    stringCount: number;
    // Errors rejecting specific translation units from the TM itself (e.g. a business-rule
    // violation on an otherwise well-formed unit).
    translationMemoryImportErrors: Array<TmxParsingErrorDto> | null;
    // Errors in the TMX file's own XML/structure, encountered while parsing it.
    parsingErrors: Array<TmxParsingErrorDto> | null;
    jobUid: string;
    tmxUid: string;
}

export { TmxImportSummaryDto };

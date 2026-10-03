import { GlossaryImportStatusDto } from "./glossary-import-status-dto";
import { ImportEntryChangesDto } from "./import-entry-changes-dto";
import { ImportEntryTranslationChangesDto } from "./import-entry-translation-changes-dto";
import { ImportWarningDto } from "./import-warning-dto";

export interface GlossaryImportResultDto {
    glossaryImport: GlossaryImportStatusDto;
    entryChanges: ImportEntryChangesDto;
    translationChanges: Array<ImportEntryTranslationChangesDto>;
    warnings: Array<ImportWarningDto>;
}

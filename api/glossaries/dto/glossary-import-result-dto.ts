import { GlossaryImportStatusDto } from "./glossary-import-status-dto";

export interface GlossaryImportResultDto extends GlossaryImportStatusDto {
    entryChanges: number;
    // Shape not fully verified against a live API response; tighten once confirmed
    // (see the real response logged by test/integration/glossaries.spec.ts with
    // SMARTLING_LOG_RESPONSES=true).
    translationChanges: Array<Record<string, unknown>>;
    warnings: Array<string>;
}

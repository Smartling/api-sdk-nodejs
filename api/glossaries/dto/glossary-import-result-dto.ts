import { GlossaryImportStatusDto } from "./glossary-import-status-dto";

export interface GlossaryImportResultDto extends GlossaryImportStatusDto {
    entryChanges: number;
    // Nested shape not independently verified against source for this field
    // (see docs/superpowers/plans/2026-10-03-glossary-v3-api.md spec's confidence
    // notes) - the integration test in Task 12 logs a real response so this can be
    // tightened later if needed.
    translationChanges: Array<Record<string, unknown>>;
    warnings: Array<string>;
}

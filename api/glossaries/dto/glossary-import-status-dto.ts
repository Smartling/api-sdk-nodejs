import { ImportStatus } from "../enums/import-status";

export interface GlossaryImportStatusDto {
    glossaryUid: string;
    importUid: string;
    importStatus: ImportStatus;
}

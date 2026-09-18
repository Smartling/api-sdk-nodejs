import { FileType } from "../params/file-type";
import { FileStatusForLocaleItemDto } from "./file-status-for-locale-item-dto";
import { FileNamespaceDto } from "./file-namespace-dto";
import { PageCountStatus } from "../params/page-count-status";

interface FileStatusForAllLocalesDto {
    created: Date;
    fileType: FileType;
    fileUri: string;
    hasInstructions: boolean;
    items: Array<FileStatusForLocaleItemDto>;
    lastUploaded: string;
    parserVersion: number;
    totalCount: number;
    totalStringCount: number;
    totalWordCount: number;
    directives?: Record<string, string>;
    namespace?: FileNamespaceDto;
    totalPageCount?: number;
    pageCountStatus?: PageCountStatus;
}

export { FileStatusForAllLocalesDto };

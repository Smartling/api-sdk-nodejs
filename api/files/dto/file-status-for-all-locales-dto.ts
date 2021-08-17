import { FileType } from "../params/file-type";
import { FileStatusForLocaleItemDto } from "./file-status-for-locale-item-dto";

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
}

export { FileStatusForAllLocalesDto };

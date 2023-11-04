import { FileType } from "../params/file-type";

interface FileStatusForProjectDto {
    created: Date;
    fileType: FileType;
    fileUri: string;
    hasInstructions: boolean;
    lastUploaded: string;
}

export { FileStatusForProjectDto };

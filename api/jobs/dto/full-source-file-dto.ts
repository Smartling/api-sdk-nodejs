import { SourceFileDto } from "./source-file-dto";

interface FullSourceFileDto extends SourceFileDto {
    name: string;
    fileUid: string;
}

export { FullSourceFileDto };

import { SourceFileDto } from "./source-file-dto";

interface FullSourceFileDto extends SourceFileDto {
    localeIds: Array<string>;
}

export { FullSourceFileDto };

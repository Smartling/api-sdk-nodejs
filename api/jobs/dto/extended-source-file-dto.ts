import { FullSourceFileDto } from "./full-source-file-dto";

interface ExtendedSourceFileDto extends FullSourceFileDto {
    localeIds?: Array<string>;
}

export { ExtendedSourceFileDto };

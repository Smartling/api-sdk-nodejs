import { CreatedStringItemDto } from "./created-string-item-dto";

interface CreateStringsResponseDto {
    wordCount: number;
    stringCount: number;
    processUid?: string;
    items: CreatedStringItemDto[];
}

export { CreateStringsResponseDto };

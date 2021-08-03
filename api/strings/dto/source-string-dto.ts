import { SourceStringKeyDto } from "./source-string-key-dto";

interface SourceStringDto {
    hashcode: string;
    keys: SourceStringKeyDto[];
    parsedStringText: string;
    stringText: string;
    stringVariant: string;
    maxLength: number;
}

export { SourceStringDto };

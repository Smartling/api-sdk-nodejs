import { SourceStringKeyDto } from "./source-string-key-dto";

export interface SourceStringDto {
    hashcode: string;
    keys: SourceStringKeyDto[];
    parsedStringText: string;
    stringText: string;
    stringVariant: string;
    maxLength: number;
}

import { Direction } from "./direction";
import { WordDelimiter } from "./word-delimeter";

interface SmartlingLanguageDto {
    description: string;
    direction: Direction;
    languageId: string;
    wordDelimiter: WordDelimiter;
}

export { SmartlingLanguageDto };

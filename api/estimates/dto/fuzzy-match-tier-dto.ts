import { FuzzyMatchTypeCode } from "../params/fuzzy-match-type-code";
import { PriceInformationDto } from "./price-information-dto";

interface FuzzyMatchTierDto {
    threshold: number;
    matchTypeCode: FuzzyMatchTypeCode;
    stringsCount: number;
    wordCount: number;
    weightedWordCount: number;
    characterCount: number;
    priceInformation: PriceInformationDto;
}

export { FuzzyMatchTierDto };

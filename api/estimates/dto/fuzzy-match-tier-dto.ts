import { FuzzyMatchTypeCode } from "../params/fuzzy-match-type-code";
import { PriceInformationDto } from "./price-information-dto";

interface FuzzyMatchTierDto {
    threshold: number;
    matchTypeCode: FuzzyMatchTypeCode;
    stringsCount: number;
    wordCount: number;
    weightedWordCount: number;
    // Nullable - FuzzyMatchTier.addWords()'s merge helper explicitly returns null when merging
    // two tiers that both already lack a character count, a real reachable path (unlike the
    // primitive-int stringsCount/wordCount/weightedWordCount fields, which can't be null).
    characterCount: number | null;
    priceInformation: PriceInformationDto | null;
}

export { FuzzyMatchTierDto };

import { EffectiveRatesRangeDto } from "./effective-rates-range-dto";
import { FuzzyMatchTierDto } from "./fuzzy-match-tier-dto";
import { PriceInformationDto } from "./price-information-dto";

interface WorkflowStepEstimateDto {
    totalWordCount: number;
    totalWeightedWordCount: number;
    totalCharacterCount: number;
    totalPageCount: number | null;
    workflowStepUid: string;
    workflowStepName: string;
    effectiveRatesRange: EffectiveRatesRangeDto;
    fuzzyMatchTiers: Array<FuzzyMatchTierDto>;
    priceInformation: PriceInformationDto | null;
    warningType: string | null;
    aiSubscriptionServiceType: string | null;
}

export { WorkflowStepEstimateDto };

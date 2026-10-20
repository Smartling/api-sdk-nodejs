import { EffectiveRatesRangeDto } from "./effective-rates-range-dto";
import { FuzzyMatchTierDto } from "./fuzzy-match-tier-dto";
import { PriceInformationDto } from "./price-information-dto";

interface WorkflowStepEstimateDto {
    totalWordCount: number;
    totalWeightedWordCount: number;
    // Nullable per the real WorkflowStepEstimate entity (Integer, unlike the primitive-int
    // word-count fields), with no null-correcting fallback in WorkflowStepEstimateConverter.
    totalCharacterCount: number | null;
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
